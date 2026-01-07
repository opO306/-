export function classifyDelta(delta: number): "minor" | "major" | "none" {
  const abs = Math.abs(delta);
  if (abs < 10) return "none";
  if (abs < 35) return "minor";
  return "major";
}
