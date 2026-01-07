import { WorldContext } from "@/butterfly/buildWorldContext";
import { SituationResultType } from "./resultType";

export function deriveResultType({
  choiceId,
  archetypeSummary,
  worldContext,
}: {
  choiceId: string;
  archetypeSummary: string;
  worldContext: WorldContext;
}): SituationResultType {
  if (choiceId === "observe") return "observed";

  if (
    choiceId === "intervene" &&
    archetypeSummary.includes("질서") &&
    worldContext.situationBias.length === 0
  ) {
    return "stabilized";
  }

  if (
    choiceId === "intervene" &&
    worldContext.situationBias.length > 0
  ) {
    return "unresolved";
  }

  if (choiceId === "distort") return "distorted";

  return "escalated";
}

