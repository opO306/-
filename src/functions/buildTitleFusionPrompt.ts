import { TitleFusionRule } from "./titleFusionRule";

export function buildTitleFusionPrompt(
  sourceTitles: string[],
  archetypeSummary: string,
  rule: TitleFusionRule
) {
  return `
너는 인크리멘털 게임의 세계관 디자이너다.
아래의 "칭호"들은 한 플레이어의 삶에서 얻어진 이름들이다.
이 이름들을 하나의 새로운 "칭호"로 해석하라.

[기존 칭호]
${sourceTitles.map((t) => `- ${t}`).join("\n")}

[현재 성향 요약]
- ${archetypeSummary}

[톤]
- ${rule.tone}

[반드시 반영할 키워드]
- ${rule.requiredKeywords.join(", ")}

[절대 사용 금지어]
- ${rule.forbiddenWords.join(", ")}

요구사항:
1. 새로운 칭호 이름 1개 (한글, 10자 이내)
2. 한 줄 설명 (서술형, 숫자/버프/게임 용어 금지)
3. 강화, 진화, 티어 같은 표현 금지
4. 기존 칭호들의 의미가 "흡수"된 느낌이어야 함

출력 형식:
- 이름: ...
- 설명: ...
`;
}

