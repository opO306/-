// functions/services/intentAnalysisService.ts
import * as admin from "firebase-admin";
import { IntentType } from "../src/types/situation";
import { ButterflyMark, ButterflyAxis } from "../src/types/butterfly";
import { intentClassifier } from "../ai/factory"; // AI 팩토리에서 가져옴
import { canUseAI } from "./aiGuard";
import { logAIUsage, updateDailyCallCount, updateDailyTokenUsage, markAIFailure } from "./aiLogger"; // 로깅 함수 임포트
import { getAIStatus, setAIStatus } from "../config/aiFlags";
import { sanitizeInput, isBlocked, isMeaningless } from "../src/functions/analyzeIntent"; // 기존 필터링 함수 임포트

// IntentType에 따른 ButterflyMark 생성 규칙
const INTENT_MARK_RULES: Record<IntentType, Partial<Record<ButterflyAxis, number>>> = {
  cautious: { orderChaos: -1 },
  responsible: { altruismSelf: +1 },
  curious: { knowledgeDestruction: -1 },
  exploitative: { altruismSelf: -1 },
  detached: { orderChaos: +1 },
  decisive: { asceticHedon: +1 },
  protective: { altruismSelf: +1, orderChaos: -1 },
  experimental: { knowledgeDestruction: +1 },
  defiant: { orderChaos: +1, altruismSelf: -1 },
  conservative: { orderChaos: -1, asceticHedon: -1 },
  bold: { asceticHedon: +1, orderChaos: +1 },
};

export async function analyzePlayerIntent(situationId: string, choiceId: string, intentText: string, uid: string) {
  // 1. AI 가드 체크
  const aiAllowed = await canUseAI(uid);

  if (!aiAllowed) {
    console.warn(`AI usage not allowed for user ${uid}, skipping intent analysis.`);
    await logAIUsage(uid, "fallback_intent", 0, false); // Fallback 사용 로그
    return { success: false, marks: [] };
  }

  // 1. 입력 길이 & 형식 가드
  const sanitizedText = sanitizeInput(intentText);

  if (!sanitizedText) {
    return { success: false, marks: [] };
  }

  // 2. 금칙 키워드 필터
  if (isBlocked(sanitizedText)) {
    console.warn("Blocked word detected in intent text:", intentText);
    return { success: false, marks: [] };
  }

  // 3. 의미 없는 입력 감지
  if (isMeaningless(sanitizedText)) {
    console.warn("Meaningless input detected:", intentText);
    return { success: false, marks: [] };
  }

  try {
    const classifiedTag = await intentClassifier.classify(sanitizedText); // AI 팩토리 사용

    const generatedMarks: ButterflyMark[] = [];
    if (classifiedTag && INTENT_MARK_RULES[classifiedTag as IntentType]) {
      generatedMarks.push({
        key: `intent_${classifiedTag}`,
        axisImpact: INTENT_MARK_RULES[classifiedTag as IntentType],
        weight: 1,
        createdAt: Date.now(),
      });
    }

    // AI 사용량 기록 및 비용 감시
    await updateDailyCallCount(uid, 1); // 호출 횟수 증가
    await updateDailyTokenUsage(uid, sanitizedText.length); // 토큰 사용량 증가 (추정치)
    await logAIUsage(uid, "gemini-1.5-flash", sanitizedText.length, true); // AI 성공 로그 (모델명은 실제 Gemini 모델명 사용)

    return { success: true, marks: generatedMarks };
  } catch (e: any) {
    console.error(`Error classifying intent for user ${uid}:`, e);
    await markAIFailure(); // AI 실패율 증가
    await logAIUsage(uid, "gemini-1.5-flash", 0, false, e.message); // AI 실패 로그
    return { success: false, marks: [] }; // LLM 호출 실패 시 빈 배열 반환 (Fallback)
  }
}

