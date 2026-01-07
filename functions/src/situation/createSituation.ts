import { db } from "../index";
import * as admin from "firebase-admin";
import { fallbackSituationText } from "./fallback";
import { buildSituationPrompt } from "../ai/buildSituationPrompt";
import { generateSituationWithAI } from "../ai/situationGenerator";
import { worldFlagsToTone } from "../butterfly/worldContext";
import { getAIStatus } from "../ops/aiHealth";
import { getThresholds } from "../butterfly/evaluateThreshold";

export async function createSituationText(uid: string) {
  const stateRef = db.doc(`playerState/${uid}`);
  const butterflyRef = db.doc(`playerButterfly/${uid}`);
  const seasonsRef = db.collection(`playerSeasons/${uid}/seasons`);

  const [stateSnap, butterflySnap, latestSeasonSnap, aiStatus, thresholds] = await Promise.all([
    stateRef.get(),
    butterflyRef.get(),
    seasonsRef.orderBy("createdAt", "desc").limit(1).get(),
    getAIStatus(),
    getThresholds(),
  ]);

  const state = stateSnap.exists ? stateSnap.data()! : {};
  const butterfly = butterflySnap.exists ? butterflySnap.data()! : {
    marks: [],
    triggeredThresholds: [],
  };
  const latestSeasonReport = latestSeasonSnap.docs[0]?.data();
  let seasonReportText: string | null = null;

  if (latestSeasonReport && latestSeasonReport.createdAt > (state.lastSituationAt ?? new admin.firestore.Timestamp(0,0))) {
    seasonReportText = latestSeasonReport.text;
  }

  if (!stateSnap.exists) {
    await stateRef.set({
      situationChainDepth: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  let situationText = fallbackSituationText();

  if (process.env.AI_ENABLED === "true" && !aiStatus.fallbackOnly) {
    try {
      const worldFlags = butterfly.triggeredThresholds ?? [];
      const worldTones = worldFlagsToTone(
        worldFlags.map((flagId: string) => {
          const threshold = thresholds.find((t) => t.id === flagId);
          return threshold ? threshold.worldFlag : null;
        }).filter(Boolean)
      );

      const jobId = state.currentJobId; // 현재 직업 ID 가져오기
      const prompt = buildSituationPrompt(worldTones, jobId);
      const aiText = await generateSituationWithAI(prompt);
      if (aiText) situationText = aiText;
    } catch (e) {
      // 이미 generateSituationWithAI에서 에러를 기록하므로, 여기서는 조용히 fallback
    }
  }

  return {
    situationText,
    options: [
      { id: "observe", label: "관찰한다" },
      { id: "intervene", label: "개입한다" },
    ],
    seasonReportText,
  };
}


