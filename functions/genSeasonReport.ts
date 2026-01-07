import { SeasonReportInput } from "@/types/seasonReport";
import { deriveSeasonTone } from "./seasonReportRule";
import { buildSeasonReportPrompt } from "./buildSeasonReportPrompt";

// TODO: 실제 LLM 호출 로직으로 대체해야 합니다.
async function callLLM(params: { model: string; temperature: number; prompt: string }) {
  console.log("LLM 호출 시뮬레이션:", params.prompt);
  // 실제 LLM 응답 대신 목업 데이터를 반환합니다.
  return {
    text: `제목: 무덤을 기록한 자의 계절\n\n본문:\n당신은 이번 시즌 동안 혼돈을 두려워하지 않았다.\n죽음을 수집하며, 욕망을 절제하는 선택을 반복했다.\n그 과정에서 이름은 바뀌었지만,\n기록하려는 태도만은 끝까지 유지되었다.`,
  };
}

function parseSeasonReport(text: string) {
  const title = text.match(/제목:\s*(.+)/)?.[1];
  const body = text.match(/본문:\s*([\s\S]+)/)?.[1];

  if (!title || !body) {
    throw new Error("Invalid season report output");
  }

  return {
    title: title.trim(),
    body: body.trim(),
  };
}

export async function genSeasonReport(
  input: SeasonReportInput
) {
  const tone = deriveSeasonTone(input.finalArchetypeSummary);

  const prompt = buildSeasonReportPrompt(input, tone);

  const res = await callLLM({
    model: "gpt-4o",
    temperature: 0.45,
    prompt,
  });

  return parseSeasonReport(res.text);
}

