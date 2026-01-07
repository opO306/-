import { ButterflyMark } from "@/types/butterfly";

export function aggregateMarks(
  marks: ButterflyMark[]
): Record<string, number> {
  const result: Record<string, number> = {};

  for (const mark of marks) {
    result[mark.key] = (result[mark.key] ?? 0) + mark.weight;
  }

  return result;
}

