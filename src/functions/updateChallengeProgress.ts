import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

/**
 * 플레이어의 챌린지 진행 상황을 업데이트합니다.
 */
export const updateChallengeProgress = functions.https.onCall(
  async (data: { uid: string; challengeId: string; currentProgress: number }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }

    const { uid, challengeId, currentProgress } = data;

    if (!uid || !challengeId || typeof currentProgress !== "number") {
      throw new functions.https.HttpsError("invalid-argument", "Missing required data.");
    }

    const playerChallengeRef = admin.firestore().doc(`playerChallenges/${uid}/${challengeId}`);

    try {
      await playerChallengeRef.update({ currentProgress });
      console.log(`Player ${uid} updated challenge ${challengeId} progress to ${currentProgress}`);
      return { success: true };
    } catch (error) {
      console.error("Error updating challenge progress:", error);
      throw new functions.https.HttpsError("internal", "Failed to update challenge progress.");
    }
  }
);

