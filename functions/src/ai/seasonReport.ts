export function buildSeasonReportPrompt(data: {
  dominantChoices: string[];
  worldFlags: string[];
  jobId?: string;
}) {
  return `
다음은 한 플레이어의 시즌 기록 요약이다.

선택 경향:
- ${data.dominantChoices.join(", ")}

세계 상태:
- ${data.worldFlags.join(", ")}

직업 관점:
- ${data.jobId ?? "아직 형성되지 않음"}

요구:
- 4~5문장
- 평가 금지
- 조언 금지
- 웹소설 톤
- 플레이어를 '당신'으로 지칭

출력:
시즌 요약 텍스트
`;
}

