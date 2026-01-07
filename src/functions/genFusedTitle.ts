import { TitleFusionInput } from "@/types/titleFusion";
import { deriveTitleFusionRule } from "./titleFusionRule";
import { buildTitleFusionPrompt } from "./buildTitleFusionPrompt";

// TODO: 실제 LLM 호출 로직으로 대체해야 합니다.
async function callLLM(params: { model: string; temperature: number; prompt: string }) {
  console.log("LLM 호출 시뮬레이션:", params.prompt);
  // 실제 LLM 응답 대신 목업 데이터를 반환합니다.
  return {
    text: `이름: 무덤의 관찰자\n설명: 죽음을 기록하며 스스로를 억제하는 자`,
  };
}

function parseTitleResult(text: string) {
  const name = text.match(/이름:\s*(.+)/)?.[1];
  const description = text.match(/설명:\s*(.+)/)?.[1];

  if (!name || !description) {
    throw new Error("Invalid LLM title fusion output");
  }

  return {
    name: name.trim(),
    description: description.trim(),
  };
}

export async function genFusedTitle(
  input: TitleFusionInput
) {
  const rule = deriveTitleFusionRule(
    input.sourceTitles,
    input.archetypeSummary
  );

  const prompt = buildTitleFusionPrompt(
    input.sourceTitles.map((t) => t.name),
    input.archetypeSummary,
    rule
  );

  const res = await callLLM({
    model: "gpt-4o",
    temperature: 0.35,
    prompt,
  });

  return parseTitleResult(res.text);
}

