export function buildTitleTaggingPrompt(titleName: string) {
  return `
칭호 이름: "${titleName}"

이 이름이 암시하는 행동 태그를
2~3개 추론하라.

출력:
- observe
- pursue
- obsession
- curious
- detached
- risk
- intervener
- guardian
- researcher
- scholar
- collector
- wanderer
- explorer

조건:
- 위 태그 목록 내에서 선택
- 쉼표로 구분하여 출력

출력:
쉼표로 구분된 태그 목록 (예: observe, curious, explorer)
`;
}

