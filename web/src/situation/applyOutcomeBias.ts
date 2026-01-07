import { WorldContext } from "@/butterfly/buildWorldContext";

export function applyOutcomeBias(
  baseResult: number,
  worldContext: WorldContext
) {
  let result = baseResult;

  for (let i = 0; i < worldContext.optionDistortion.length; i++) {
    result *= 1.2; // 분산 확대 예시
  }

  return result;
}

