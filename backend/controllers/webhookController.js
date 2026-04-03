import { supabase } from "../supabase.js";
import { getCommitFiles, fetchFileContent } from "../utils/github.js";
import { scanForSecrets } from "../utils/scanner.js";
import { isSensitiveFilename, isExcludedFile } from "../utils/patterns.js";

async function processFile(file, commitSha, repoFullName, userId) {
  if (file.status === "removed") return;

  const filename = file.filename;

  if (isExcludedFile(filename)) {
    console.log(`   ⏭️  Skipped (excluded): ${filename}`);
    return;
  }

  let findings = [];

  // 1️⃣ Sensitive filename check
  if (isSensitiveFilename(filename)) {
    findings.push({ type: "Sensitive file committed", file: filename, entropy: null });
  }

  // 2️⃣ Scan file content
  if (file.raw_url) {
    const content = await fetchFileContent(file.raw_url);
    if (content) {
      findings = [...findings, ...scanForSecrets(content, filename)];
    }
  }

  if (findings.length === 0) {
    console.log(`   ✅ Clean: ${filename}`);
    return;
  }

  // 3️⃣ Bulk insert into Supabase with USER ATTRITUBTION
  const alerts = findings.map((finding) => ({
    user_id: userId, // 👈 CRITICAL: This allows the frontend to find the alert
    source: "github",
    message: `Secret detected in file: ${finding.file}`,
    risk: "critical",
    reason: `[${finding.type}] in ${finding.file} — commit ${commitSha.slice(0, 7)}${
      finding.entropy ? ` (entropy: ${finding.entropy})` : ""
    }`,
    suggestion:
      "Remove the secret immediately, rotate/revoke the key, and audit access logs. Use git-filter-repo to purge from history.",
    repo: repoFullName,
    commit_sha: commitSha,
    file_path: finding.file,
    status: 'open'
  }));

  const { error } = await supabase.from("alerts").insert(alerts);
  if (error) console.error(`❌ Supabase insert error:`, error.message);

  findings.forEach((f) =>
    console.log(
      `   🚨 [${f.type}] in ${f.file}` + (f.entropy ? ` | entropy: ${f.entropy}` : "")
    )
  );
}

export async function handleGithubWebhook(req, res) {
  res.sendStatus(200); // Respond fast to avoid GitHub timeout

  try {
    const { commits, repository } = req.body;

    if (!commits || !repository) {
      console.log("⚠️  Webhook received but no commits/repository in payload");
      return;
    }

    const repoFullName = repository.full_name;
    console.log(`\n🚀 Push received — repo: ${repoFullName} | commits: ${commits.length}`);

    // 🕵️ LOOKUP: Find the user who connected this repo
    const { data: repoRecord, error: repoError } = await supabase
      .from("connected_repos")
      .select("user_id")
      .eq("repo", repoFullName)
      .single();

    if (repoError || !repoRecord) {
      console.error(`❌ Attribution Error: Repo ${repoFullName} not found in connected_repos table.`);
      return;
    }

    const userId = repoRecord.user_id;

    // ✅ Fetch all commit file lists in PARALLEL
    const allCommitFiles = await Promise.all(
      commits.map((commit) =>
        getCommitFiles(repoFullName, commit.id).then((files) => ({
          sha: commit.id,
          files,
        }))
      )
    );

    // ✅ Process all files across all commits in PARALLEL with the userId
    const allTasks = allCommitFiles.flatMap(({ sha, files }) =>
      files.map((file) => processFile(file, sha, repoFullName, userId))
    );

    await Promise.all(allTasks);

    console.log(
      `\n✅ Done — scanned ${allTasks.length} file(s) across ${commits.length} commit(s) for User: ${userId}`
    );
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
  }
}