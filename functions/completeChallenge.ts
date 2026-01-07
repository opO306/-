import { onCall, CallableRequest, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
admin.initializeApp();

import Decimal from "break_infinity.js";
import { DailyChallengeInstance } from "../types/challenge";

/**
 * 플레이어가 챌린지를 완료하면 보상을 지급하고 진행 상황을 기록합니다.
 */
export const completeChallenge = onCall(async (request: CallableRequest<{ challengeId: string; completionTime: number; dailyChallenge: DailyChallengeInstance }>) => {
  const { data, auth } = request;

  if (!auth) {
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }

  const { challengeId, completionTime, dailyChallenge } = data;
  const uid = auth.uid;

  if (!uid || !challengeId || typeof completionTime !== "number" || !dailyChallenge) {
    throw new HttpsError("invalid-argument", "Missing required data.");
  }

  const playerChallengeRef = admin.firestore().doc(`playerChallenges/${uid}/${challengeId}`);
  const playerRef = admin.firestore().doc(`players/${uid}`);

    let rewards = {
      prestigePoints: dailyChallenge.rewards.prestigePoints,
      relicShards: dailyChallenge.rewards.relicShards,
      fame: 0, // 임시
    };

    // TODO: 실제 보상 계산 로직 (difficultyScore, rewardPts 등) 구현
    // 현재는 dailyChallenge에 정의된 rewards를 그대로 사용합니다.

    try {
      await admin.firestore().runTransaction(async (transaction) => {
        const playerSnap = await transaction.get(playerRef);
        const playerData = playerSnap.data() || {};

        // 플레이어 보상 업데이트
        const currentPrestigePoints = new Decimal(playerData.prestigePoints || "0");
        const newPrestigePoints = currentPrestigePoints.plus(rewards.prestigePoints).toString();
        const currentFame = new Decimal(playerData.fame || "0");
        const newFame = currentFame.plus(rewards.fame || 0).toString();

        transaction.update(playerRef, {
          prestigePoints: newPrestigePoints,
          fame: newFame,
          // ... 기타 보상 필드 업데이트 (relicShards, exclusiveTitle)
        });

        // 챌린지 진행 상황 완료로 업데이트
        transaction.update(playerChallengeRef, {
          isCompleted: true,
          completionTime: completionTime,
        });
      });

      console.log(`Player ${uid} completed challenge ${challengeId}. Rewards:`, rewards);
      return { success: true, rewards };
    } catch (error) {
      console.error("Error completing challenge:", error);
      throw new HttpsError("internal", "Failed to complete challenge.");
    }
  }
);

