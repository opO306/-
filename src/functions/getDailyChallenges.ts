import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

import { DailyChallengeInstance } from "../types/challenge";

/**
 * Firestore에서 오늘의 챌린지 목록을 가져옵니다.
 */
export const getDailyChallenges = functions.https.onCall(
  async (data, context) => {
    // 인증 확인 (선택 사항)
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dailyDocId = `${yyyy}${mm}${dd}`;

    const dailyChallengesRef = admin.firestore().collection("dailyChallenges").doc(dailyDocId);

    try {
      const snapshot = await dailyChallengesRef.get();

      if (snapshot.exists) {
        const data = snapshot.data();
        return { challenges: data?.challenges || [] };
      } else {
        return { challenges: [] }; // 오늘 생성된 챌린지가 없으면 빈 배열 반환
      }
    } catch (error) {
      console.error("Error fetching daily challenges:", error);
      throw new functions.https.HttpsError("internal", "Failed to fetch daily challenges.");
    }
  }
);

