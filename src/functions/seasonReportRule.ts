export type SeasonReportTone =
  | "contemplative"
  | "fanatic"
  | "cold"
  | "solemn";

export function deriveSeasonTone(
  archetypeSummary: string
): SeasonReportTone {
  if (archetypeSummary.includes("혼돈")) return "fanatic";
  if (archetypeSummary.includes("금욕")) return "cold";
  if (archetypeSummary.includes("파괴")) return "solemn";
  return "contemplative";
}

