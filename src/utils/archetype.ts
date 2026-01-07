import Decimal from "decimal.js";
import { ArchetypeVector } from "../data/archetypeAxes";
import { SessionMetrics } from "../types/metrics";

/**
 * Normalize a metric value to range -1 … +1 using min/max anchors.
 */
function scale(v: number, min: number, max: number) {
  if (v <= min) return -1;
  if (v >= max) return 1;
  return ((v - min) / (max - min)) * 2 - 1; // 0→-1, max→+1
}

export function calcArchetype(m: SessionMetrics): ArchetypeVector {
  return {
    orderChaos: scale(m.prestigeGapMin, 5, 120),              // 짧을수록 혼돈
    altruismSelf: scale(1 - m.stayExpeditionSec / (m.stayResearchSec + 1), 0.3, 0.9),
    asceticHedon: scale(m.highRiskExpeditions, 0, 20),
    knowledgeDestruction: scale(
      new Decimal(m.researchCost).log(10).toNumber() - new Decimal(m.upgradeCost).log(10).toNumber(),
      -3,
      3,
    ),
  };
}
