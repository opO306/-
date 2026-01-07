import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

import { PlayerChallengeProgress } from "../types/challenge";

/**
 * 플레이어가 챌린지를 시작하면 Firestore에 진행 상황을 기록합니다.
 */
export const startChallenge = functions.https.onCall(
  async (data: { uid: string; challengeId: string; initialProgress: PlayerChallengeProgress }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }

    const { uid, challengeId, initialProgress } = data;

    if (!uid || !challengeId || !initialProgress) {
      throw new functions.https.HttpsError("invalid-argument", "Missing required data.");
    }

    const playerChallengeRef = admin.firestore().doc(`playerChallenges/${uid}/${challengeId}`);

    try {
      await playerChallengeRef.set(initialProgress, { merge: true });
      console.log(`Player ${uid} started challenge ${challengeId}`);
      return { success: true };
    } catch (error) {
      console.error("Error starting challenge:", error);
      throw new functions.https.HttpsError("internal", "Failed to start challenge.");
    }
  }
);

