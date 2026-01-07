// functions/fallback/resultTextFallback.ts
export function fallbackResultText(choiceId: string): string {
  // TODO: choiceId에 따른 좀 더 정교한 Fallback 결과 텍스트 구현
  if (choiceId === "observe") {
    return "당신은 상황을 지켜보기로 했다.";
  }
  if (choiceId === "intervene") {
    return "당신은 상황에 개입하기로 했다.";
  }
  if (choiceId === "distort") {
    return "당신은 상황을 다른 방향으로 이끌었다.";
  }
  return "선택의 결과는 아직 드러나지 않았다.";
}

