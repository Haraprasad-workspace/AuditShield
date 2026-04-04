import { shannonEntropy, isHighEntropy } from "./entropy.js";
import { SECRET_PATTERNS, isSafeValue } from "./patterns.js";

export function scanForSecrets(content, filename) {
  const findings = [];
  const seen = new Set();

  for (const pattern of SECRET_PATTERNS) {
    pattern.regex.lastIndex = 0;
    let match;

    while ((match = pattern.regex.exec(content)) !== null) {
      const extractedValue = pattern.extract ? pattern.extract(match) : null;

      if (extractedValue !== null) {
        if (isSafeValue(extractedValue)) continue;
        if (!isHighEntropy(extractedValue)) continue;
      }

      const key = `${pattern.name}::${filename}`;
      if (seen.has(key)) continue;
      seen.add(key);

      findings.push({
        type: pattern.name,
        file: filename,
        entropy: extractedValue ? shannonEntropy(extractedValue).toFixed(2) : null,
        match: match,
        value: extractedValue
      });
    }

    pattern.regex.lastIndex = 0;
  }

  return findings;
}