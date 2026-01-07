import { onCall, CallableRequest, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
admin.initializeApp();

/**
 * 플레이어의 챌린지 진행 상황을 업데이트합니다.
 */
export const updateChallengeProgress = onCall(async (request: CallableRequest<{ challengeId: string; currentProgress: number }>) => {
  const { data, auth } = request;

  if (!auth) {
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }

  const { challengeId, currentProgress } = data;
  const uid = auth.uid;

  if (!uid || !challengeId || typeof currentProgress !== "number") {
    throw new HttpsError("invalid-argument", "Missing required data.");
  }

  const playerChallengeRef = admin.firestore().doc(`playerChallenges/${uid}/${challengeId}`);

    try {
      await playerChallengeRef.update({ currentProgress });
      console.log(`Player ${uid} updated challenge ${challengeId} progress to ${currentProgress}`);
      return { success: true };
    } catch (error) {
      console.error("Error updating challenge progress:", error);
      throw new HttpsError("internal", "Failed to update challenge progress.");
    }
  }
);

