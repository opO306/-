import { WorldContext } from "@/butterfly/buildWorldContext";

export function applyOutcomeBias(
  baseResult: number,
  worldContext: WorldContext
) {
  let result = baseResult;

  for (const bias of worldContext.optionDistortion) {
    result *= 1.2; // 분산 확대 예시
  }

  return result;
}

