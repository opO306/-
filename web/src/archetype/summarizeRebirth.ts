export function summarizeRebirth(diff: string[]): string {
  if (diff.length === 0) return "변화 없는 환생";

  if (diff.length === 1) return `이번 환생으로 ${diff[0]}`;

  return `이번 환생으로 ${diff[0]}, 그리고 ${diff[1]}`;
}
