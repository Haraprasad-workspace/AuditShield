export function shannonEntropy(str) {
  const freq = {};
  for (const ch of str) freq[ch] = (freq[ch] || 0) + 1;
  return Object.values(freq).reduce((entropy, count) => {
    const p = count / str.length;
    return entropy - p * Math.log2(p);
  }, 0);
}

export const ENTROPY_THRESHOLD = 4.5;
export const MIN_SECRET_LENGTH = 20;
export const MAX_SECRET_LENGTH = 512;

export function isHighEntropy(value) {
  return (
    value.length >= MIN_SECRET_LENGTH &&
    value.length <= MAX_SECRET_LENGTH &&
    shannonEntropy(value) >= ENTROPY_THRESHOLD
  );
}