import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

import { ButterflyMark } from "../types/butterfly";
import { analyzeIntentText } from "../../functions/services/intentService"; // AI 서비스 레이어에서 가져오기
import { INTENT_MARK_RULES } from "../../functions/ai/geminiIntentClassifier"; // INTENT_MARK_RULES 재사용

export const analyzeIntent = functions.https.onCall(
  async (data: { situationId: string; choiceId: string; intentText: string }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }

    const { situationId, choiceId, intentText } = data;
    const uid = context.auth.uid;

    const classifiedIntents = await analyzeIntentText(intentText, uid);

    const generatedMarks: ButterflyMark[] = classifiedIntents.map(intent => ({
      key: `intent_${intent}`,
      axisImpact: INTENT_MARK_RULES[intent],
      weight: 1,
      createdAt: Date.now(),
    }));

    // TODO: getDailyCallCount 업데이트 로직 (성공 시)
    return { success: true, marks: generatedMarks };
  }
);
