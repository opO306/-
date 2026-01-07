// functions/services/intentService.ts
import { IntentType } from "../../src/types/situation";
import { intentClassifier } from "../ai/factory"; // AI 팩토리에서 가져온 classifier
import { canUseAI } from "./aiGuard"; // AI 가드 함수
import { sanitizeInput, isBlocked, isMeaningless } from "../ai/aiInputGuard"; // 가드 함수 재사용

export async function analyzeIntentText(
  intentText: string
): Promise<IntentType[]> {
  // 1. AI 가드
  const aiAllowed = await canUseAI();
  if (!aiAllowed) {
    console.warn("AI is disabled or limit reached for intent analysis, skipping.");
    return []; // AI 비활성화 또는 제한 초과 시 빈 배열 반환
  }

  // 2. 입력 길이 & 형식 가드
  const sanitizedText = sanitizeInput(intentText);
  if (!sanitizedText) {
    return [];
  }

  // 3. 금칙 키워드 필터
  if (isBlocked(sanitizedText)) {
    console.warn("Blocked word detected in intent text:", intentText);
    return [];
  }

  // 4. 의미 없는 입력 감지
  if (isMeaningless(sanitizedText)) {
    console.warn("Meaningless input detected:", intentText);
    return [];
  }

  try {
    const classifiedTag = await intentClassifier.classify(sanitizedText);
    // TODO: logAIUsage(uid, intentClassifier.model); // AI 사용량 로그
    if (classifiedTag) {
      return [classifiedTag as IntentType];
    }
    return [];
  } catch (error) {
    console.error("Error classifying intent with AI:", error);
    // TODO: markAIFailure(); // AI 실패율 증가
    return []; // LLM 호출 실패 시 빈 배열 반환 (Fallback)
  }
}

