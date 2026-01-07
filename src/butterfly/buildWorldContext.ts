import { ButterflyOutcome } from "./threshold";

export type WorldContext = {
  toneHints: string[];      // AI 분위기 유도
  situationBias: string[]; // 상황 성격 변화
  optionDistortion: string[]; // 선택지 왜곡
};

export function buildWorldContext(
  outcomes: ButterflyOutcome[]
): WorldContext {
  const context: WorldContext = {
    toneHints: [],
    situationBias: [],
    optionDistortion: [],
  };

  for (const o of outcomes) {
    switch (o.type) {
      case "unlock_event_pool":
        context.situationBias.push(
          "상황이 불안정하거나 예측 불가한 방향으로 전개될 수 있다"
        );
        break;

      case "modify_outcome_bias":
        context.optionDistortion.push(
          `${o.value.axis} 성향이 개입할 경우 결과가 극단적으로 변할 수 있다`
        );
        break;

      case "unlock_title_track":
        context.toneHints.push(
          "상황은 기록과 관찰의 의미를 강조한다"
        );
        break;

      case "world_state_flag":
        context.toneHints.push(
          `세계 상태: ${o.value}`
        );
        break;
    }
  }

  return context;
}

