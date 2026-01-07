
export function buildResultText({
  choiceId,
  archetypeSummary,
  worldContext,
}: {
  choiceId: string;
  archetypeSummary: string;
  worldContext: { situationBias: string[] };
}) {
  if (choiceId === "observe") {
    return "아무 일도 하지 않았지만,\n그 선택은 기록으로 남았다.";
  }

  if (
    choiceId === "intervene" &&
    archetypeSummary.includes("질서")
  ) {
    return "당신의 개입으로\n상황은 안정되었다.";
  }

  if (
    choiceId === "intervene" &&
    worldContext.situationBias.length > 0
  ) {
    return "개입은 성공했지만,\n상황은 완전히 정리되지 않았다.";
  }

  return "선택의 여파는\n아직 드러나지 않았다.";
}

