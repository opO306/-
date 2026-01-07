import { SituationResultType } from "./resultType";

export function shouldEndChain({
  chainLength,
  resultType,
  constraintMode,
}: {
  chainLength: number;
  resultType: SituationResultType;
  constraintMode: string;
}) {
  if (resultType === "stabilized") return true;
  if (chainLength >= 3) return true;
  if (constraintMode === "safe") return true;
  return false;
}

