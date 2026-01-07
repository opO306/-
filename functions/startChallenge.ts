import { onCall, CallableRequest, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
admin.initializeApp();

import { PlayerChallengeProgress } from "../types/challenge";

/**
 * 플레이어가 챌린지를 시작하면 Firestore에 진행 상황을 기록합니다.
 */
export const startChallenge = onCall(async (request: CallableRequest<{ challengeId: string; initialProgress: PlayerChallengeProgress }>) => {
  const { data, auth } = request;

  if (!auth) {
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }

  const { challengeId, initialProgress } = data;
  const uid = auth.uid;

  if (!uid || !challengeId || !initialProgress) {
    throw new HttpsError("invalid-argument", "Missing required data.");
  }

  const playerChallengeRef = admin.firestore().doc(`playerChallenges/${uid}/${challengeId}`);

    try {
      await playerChallengeRef.set(initialProgress, { merge: true });
      console.log(`Player ${uid} started challenge ${challengeId}`);
      return { success: true };
    } catch (error) {
      console.error("Error starting challenge:", error);
      throw new HttpsError("internal", "Failed to start challenge.");
    }
  }
);

