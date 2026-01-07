import { SummarizedBehavior } from "../../src/freeChoice/summarizeSeasonBehavior";

export function buildSynthesizedTitlePrompt(tags: string[], behavior?: SummarizedBehavior) {
  let behaviorContext = "";
  if (behavior) {
    behaviorContext = `
플레이어의 행동 요약:
- 지배적인 톤: ${behavior.dominantTone}
- 핵심 행동: ${behavior.causeKeyword}
`;
  }

  return `
다음 태그 조합과 플레이어 행동 요약을 표현하는
새로운 칭호 이름을 만들어라.
${behaviorContext}

태그:
${tags.map(tag => `- ${tag}`).join("\n")}

조건:
- 명사
- 2~4글자
- 평가/감정 단어 금지
- 직업과 자연스럽게 결합 가능

출력:
칭호 이름 하나
`;
}

