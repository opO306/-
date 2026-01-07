import { JOB_PERSPECTIVE } from "../job/jobPerspective";

export function buildSituationPrompt(
  worldTones: string[] = [],
  baseJobId?: string,
  compositeJobName?: string
) {
  let jobContext = "";
  if (compositeJobName) {
    jobContext += `현재 직업:\n- ${compositeJobName}\n`;
  }
  if (baseJobId && JOB_PERSPECTIVE[baseJobId]) {
    jobContext += `직업 관점:\n- ${JOB_PERSPECTIVE[baseJobId]}\n`;
  }

  return `
3~4문장의 상황을 서술하라.

${jobContext}
세계 상태:
${worldTones.map(t => `- ${t}`).join("\n")}

규칙:
- 결론 금지
- 보상 언급 금지
- 설명 금지
- 웹소설 톤

출력:
상황 텍스트만
`;
}

