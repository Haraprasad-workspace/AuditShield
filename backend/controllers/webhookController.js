import { supabase } from "../supabase.js";
import { getCommitFiles, fetchFileContent } from "../utils/github.js";
import { scanForSecrets } from "../utils/scanner.js";
import { isSensitiveFilename, isExcludedFile } from "../utils/patterns.js";

async function processFile(file, commitSha, repoFullName, userId) {
  if (file.status === "removed") return;

  const filename = file.filename;

  if (isExcludedFile(filename)) {
    return;
  }

  let findings = [];

  // 1️⃣ Sensitive filename check
  if (isSensitiveFilename(filename)) {
    findings.push({
      type: "Sensitive file committed",
      file: filename,
      entropy: null,
    });
  }

  // 2️⃣ Scan file content
  if (file.raw_url) {
    const content = await fetchFileContent(file.raw_url);
    if (content) {
      const contentFindings = scanForSecrets(content, filename);
      findings = [...findings, ...contentFindings];
    }
  }

  if (findings.length === 0) {
    return;
  }

  // 3️⃣ Map findings to alert objects
  const alerts = findings.map((finding) => ({
    user_id: userId,
    source: "github",
    message: `Secret detected in file: ${finding.file}`,
    risk: "critical",
    reason: `[${finding.type}] in ${finding.file} — commit ${commitSha.slice(
      0,
      7
    )}${finding.entropy ? ` (entropy: ${finding.entropy})` : ""}`,
    suggestion:
      "Remove the secret immediately, rotate/revoke the key, and audit access logs. Use git-filter-repo to purge from history.",
    repo: repoFullName,
    commit_sha: commitSha,
    file_path: finding.file,
    status: "open",
    created_at: new Date().toISOString(),
  }));

  // ✅ Deduplication logic
  for (const alert of alerts) {
    const tenSecondsAgo = new Date(Date.now() - 10000).toISOString();

    const { data: existing, error: checkError } = await supabase
      .from("alerts")
      .select("id")
      .eq("message", alert.message)
      .eq("commit_sha", alert.commit_sha)
      .gt("created_at", tenSecondsAgo)
      .maybeSingle();

    if (checkError) {
      console.error("Deduplication check error:", checkError.message);
    }

    if (!existing) {
      const { error } = await supabase.from("alerts").insert([alert]);

      if (error) {
        console.error("Alert insert error:", error.message);
      }
    }
  }
}

export async function handleGithubWebhook(req, res) {
  const githubEvent = req.headers["x-github-event"];

  if (githubEvent !== "push") {
    return res.status(200).send("Ignored");
  }

  res.sendStatus(200);

  try {
    const { commits, repository } = req.body;

    if (!commits || !repository || commits.length === 0) {
      return;
    }

    const repoFullName = repository.full_name;

    // 🕵️ Find user
    const { data: repoRecord, error: repoError } = await supabase
      .from("connected_repos")
      .select("user_id")
      .eq("repo", repoFullName)
      .single();

    if (repoError || !repoRecord) {
      console.error(
        `Repository ${repoFullName} not linked to any user`
      );
      return;
    }

    const userId = repoRecord.user_id;

    // Fetch files for commits
    const allCommitFiles = await Promise.all(
      commits.map((commit) =>
        getCommitFiles(repoFullName, commit.id).then((files) => ({
          sha: commit.id,
          files,
        }))
      )
    );

    // Process files
    const allTasks = allCommitFiles.flatMap(({ sha, files }) =>
      files.map((file) =>
        processFile(file, sha, repoFullName, userId)
      )
    );

    await Promise.all(allTasks);
  } catch (err) {
    console.error("Webhook processing failed:", err.message);
  }
}