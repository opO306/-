import { SeasonReportTone } from "./seasonReportRule";
import { SeasonReportInput } from "@/types/seasonReport";

export function buildSeasonReportPrompt(
  input: SeasonReportInput,
  tone: SeasonReportTone
) {
  return `
너는 게임 플레이 기록을 바탕으로
플레이어의 한 시즌을 '인생 요약'으로 정리하는 기록자다.

[최종 정체성]
- 파생 직업: ${input.finalCompositeJob.name}
- 설명: ${input.finalCompositeJob.description}
- 성향: ${input.finalArchetypeSummary}

[칭호의 흐름]
${input.titleTimeline
  .map((t) => `- ${t.name}`)
  .join("\n")}

[대표적인 선택]
${input.notableActions.map((a) => `- ${a}`).join("\n")}

[톤]
- ${tone}

요구사항:
1. 시즌 요약 본문 (3~4문장, 서술형)
2. 시즌을 상징하는 한 줄 제목 1개
3. 숫자, 게임 용어, 랭킹 표현 금지
4. 플레이어를 평가하지 말고 "기록"하라

출력 형식:
- 제목: ...
- 본문: ...
`;
}

