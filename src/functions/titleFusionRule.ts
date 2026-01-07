export type TitleFusionRule = {
  tone: "neutral" | "cold" | "fanatic" | "solemn";
  requiredKeywords: string[];
  forbiddenWords: string[];
};

export function deriveTitleFusionRule(
  titles: { name: string; tags: string[] }[],
  archetypeSummary: string
): TitleFusionRule {
  const requiredKeywords = new Set<string>();
  const forbiddenWords = new Set<string>([
    "신",
    "왕",
    "궁극",
    "전설",
    "SSR",
  ]);

  titles.forEach((t) => t.tags.forEach((tag) => requiredKeywords.add(tag)));

  let tone: TitleFusionRule["tone"] = "neutral";
  if (archetypeSummary.includes("금욕")) tone = "cold";
  if (archetypeSummary.includes("혼돈")) tone = "fanatic";
  if (archetypeSummary.includes("파괴")) tone = "solemn";

  return {
    tone,
    requiredKeywords: Array.from(requiredKeywords),
    forbiddenWords: Array.from(forbiddenWords),
  };
}

