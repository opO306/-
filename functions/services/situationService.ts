// functions/services/situationService.ts
import { SituationGenInput } from "../../src/types/situation";
import { buildSituationPrompt } from "../../functions/buildSituationPrompt";
import { fallbackSituationText } from "../../functions/fallback/situationFallback";
import { situationGenerator } from "../ai/factory"; // AI 팩토리에서 가져온 generator
import { canUseAI } from "./aiGuard"; // AI 가드 함수

export async function createSituation(
  input: SituationGenInput
): Promise<{ text: string; source: "ai" | "fallback"; model?: string }> {
  const aiAllowed = await canUseAI();

  if (!aiAllowed) {
    return {
      text: fallbackSituationText(input),
      source: "fallback",
    };
  }

  try {
    const prompt = buildSituationPrompt(input.worldContext.situationBias, input.jobTags[0]); // jobTags의 첫 번째 요소를 baseJobId로 전달 (임시)
    const result = await situationGenerator.generate(prompt);
    // TODO: logAIUsage(uid, result.model, tokenEstimate); // AI 사용량 로그
    return { text: result.text, source: "ai", model: result.model };
  } catch (e) {
    console.error("Error generating situation with AI:", e);
    // TODO: markAIFailure(); // AI 실패율 증가
    return {
      text: fallbackSituationText(input),
      source: "fallback",
    };
  }
}
