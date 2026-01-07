import { ButterflyMark } from "@/types/butterfly";
import { BUTTERFLY_THRESHOLDS } from "./thresholdTable";
import { aggregateMarks } from "./analyzeMarks";

export type TriggeredOutcome = {
  thresholdId: string;
  outcome: any;
};

export function evaluateButterflyThresholds(
  marks: ButterflyMark[],
  alreadyTriggered: Set<string>
): TriggeredOutcome[] {
  const aggregated = aggregateMarks(marks);
  const triggered: TriggeredOutcome[] = [];

  for (const threshold of BUTTERFLY_THRESHOLDS) {
    if (alreadyTriggered.has(threshold.id)) continue;

    const totalWeight = threshold.requiredKeys.reduce(
      (sum, key) => sum + (aggregated[key] ?? 0),
      0
    );

    if (totalWeight >= threshold.minTotalWeight) {
      triggered.push({
        thresholdId: threshold.id,
        outcome: threshold.outcome,
      });
    }
  }

  return triggered;
}

