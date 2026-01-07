import { onCall, CallableRequest, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
admin.initializeApp();

/**
 * Firestore에서 오늘의 챌린지 목록을 가져옵니다.
 */
export const getDailyChallenges = onCall(async (request: CallableRequest<any>) => {
  const { auth } = request;

  // 인증 확인 (선택 사항)
  if (!auth) {
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }

  // const today = new Date();
  // const yyyy = today.getFullYear();
  // const mm = String(today.getMonth() + 1).padStart(2, "0");
  // const dd = String(today.getDate()).padStart(2, "0");
  // const dailyDocId = `${yyyy}${mm}${dd}`;

  const dailyDocId = "20260108"; // 임시 고정값

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
    throw new HttpsError("internal", "Failed to fetch daily challenges.");
  }
});