import { onCall, CallableRequest, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
admin.initializeApp();

import { ButterflyMark } from "../types/butterfly"; // ButterflyAxis도 임포트
import { analyzeIntentText } from "../../functions/services/intentService"; // AI 서비스 레이어에서 가져오기
import { INTENT_MARK_RULES } from "../../functions/ai/intentRules"; // INTENT_MARK_RULES 재사용
import { IntentType } from "../../src/types/situation"; // IntentType 임포트

export const analyzeIntent = onCall(async (request: CallableRequest<{ intentText: string }>) => {
  const { data, auth } = request;

  if (!auth) {
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }

  const { intentText } = data;
  const classifiedIntents = await analyzeIntentText(intentText);

  const generatedMarks: ButterflyMark[] = classifiedIntents.map(intent => ({
    key: `intent_${intent}`,
    axisImpact: INTENT_MARK_RULES[intent as IntentType],
    weight: 1,
    createdAt: Date.now(),
  }));

  // TODO: getDailyCallCount 업데이트 로직 (성공 시)
  return { success: true, marks: generatedMarks };
}
);
