export function buildSynthesizedTitlePrompt(tags: string[]) {
  return `
다음 태그 조합을 표현하는
새로운 칭호 이름을 만들어라.

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

