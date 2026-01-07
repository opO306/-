import { SituationGenInput } from "@/types/situation";

export function buildSituationPrompt(
  input: SituationGenInput
) {
  return `
너는 인크리멘털 게임의 '상황 설계자'다.
플레이어에게 판단을 요구하는 상황만 생성하라.

[플레이어 맥락]
- 직업 태그: ${input.jobTags.map(tag => `  - ${tag}`).join('\n')}
- 현재 성향: ${input.archetypeSummary}
- 선택한 태도: ${input.constraintMode}

[이전 선택의 여파]
- ${input.chainHint?.tone ?? "이전 맥락 없음"}
- 위험도: ${input.chainHint?.riskLevel ?? "중립"}

[세계 상태 힌트]
${input.worldContext.toneHints.map(t => `- ${t}`).join("\n")}

[상황 성격]
${input.worldContext.situationBias.map(s => `- ${s}`).join("\n")}

[선택지 왜곡]
${input.worldContext.optionDistortion.map(o => `- ${o}`).join("\n")}

[반복 방지 해시]
${input.recentSituationHashes.join(", ")}

요구사항:
1. 3~4문장의 상황 서술만 생성
2. 결말, 보상, 성공/실패 암시 금지
3. 동일한 상황 반복 금지
4. 수치, 게임 용어 사용 금지
5. 웹소설 톤, 건조하지만 긴장감 유지

출력:
- 상황: ...
`;
}

