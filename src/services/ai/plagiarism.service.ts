import type { PlagiarismRequest } from "@/validators/ai.validator";

const commonPhrases = [
  "in conclusion",
  "it is important to note",
  "in today's digital age",
  "at the end of the day",
  "a wide range of",
  "plays a vital role",
];

export function checkPlagiarism(input: PlagiarismRequest) {
  const normalized = input.text.toLowerCase();
  const words = normalized.match(/\b[\w']+\b/g) ?? [];
  const uniqueWords = new Set(words);
  const repeatedPhraseCount = commonPhrases.filter((phrase) =>
    normalized.includes(phrase),
  ).length;
  const uniqueness =
    words.length === 0 ? 100 : Math.round((uniqueWords.size / words.length) * 100);
  const riskScore = Math.min(
    100,
    Math.max(0, 100 - uniqueness + repeatedPhraseCount * 8),
  );

  return {
    originalityScore: 100 - riskScore,
    riskScore,
    matchedPhrases: commonPhrases.filter((phrase) => normalized.includes(phrase)),
    message:
      "This local originality check flags repeated/common phrasing. Connect a plagiarism provider for web-scale source matching.",
  };
}
