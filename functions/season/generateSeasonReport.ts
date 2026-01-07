import * as admin from "firebase-admin";
import { db } from "../index";
import { buildSeasonReportPrompt } from "../ai/seasonReport";
import { generateSituationWithAI } from "../ai/openaiSituationGenerator";
import { worldFlagsToTone } from "../butterfly/worldContext";
import { BUTTERFLY_THRESHOLDS } from "../../src/butterfly/thresholdTable";
import { ButterflyThreshold } from "../../src/butterfly/threshold";

export async function generateSeasonReport(uid: string) {
  const logsRef = db.collection(`playerSituations/${uid}/logs`);
  const seasonsRef = db.collection(`playerSeasons/${uid}/seasons`);
  const stateRef = db.doc(`playerState/${uid}`);
  const butterflyRef = db.doc(`playerButterfly/${uid}`);

  // 현재 시즌의 로그 가져오기 (예: 최근 30개)
  const logsSnap = await logsRef.orderBy("createdAt", "desc").limit(30).get();
  const logs = logsSnap.docs.map((doc) => doc.data());

  // 선택 경향 분석 (간단하게 최빈값 사용)
  const choiceCounts: { [key: string]: number } = {};
  logs.forEach((log) => {
    choiceCounts[log.choiceId] = (choiceCounts[log.choiceId] ?? 0) + 1;
  });

  const dominantChoices = Object.keys(choiceCounts).sort(
    (a, b) => choiceCounts[b] - choiceCounts[a]
  );

  // 세계 상태 가져오기
  const butterflySnap = await butterflyRef.get();
  const butterfly = butterflySnap.exists ? butterflySnap.data()! : {
    marks: [],
    triggeredThresholds: [],
  };

  const worldFlags = butterfly.triggeredThresholds ?? [];
  const worldTones = worldFlagsToTone(
    worldFlags.map((flagId: string) => {
      const threshold = BUTTERFLY_THRESHOLDS.find((t: ButterflyThreshold) => t.id === flagId);
      return threshold && threshold.outcome.type === "world_state_flag" ? threshold.outcome.value : null;
    }).filter(Boolean)
  );

  // 현재 직업 ID 가져오기
  const stateSnap = await stateRef.get();
  const state = stateSnap.exists ? stateSnap.data()! : {};
  const jobId = state.currentJobId;

  const prompt = buildSeasonReportPrompt({
    dominantChoices,
    worldFlags: worldTones, // worldFlags 대신 worldTones를 전달
    jobId,
  });

  let reportText: string | null | undefined = null;
  if (process.env.AI_ENABLED === "true") {
    try {
      reportText = await generateSituationWithAI(prompt); // 재활용
    } catch (e) {
      console.error("Error generating season report with AI:", e);
    }
  }

  if (!reportText) {
    reportText = "이번 시즌은 특별한 사건 없이 흘러갔습니다. 당신의 선택이 다음 시즌에 어떤 영향을 미칠지 기대됩니다."; // Fallback
  }

  await seasonsRef.add({
    text: reportText,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // 시즌 리포트 생성 후 state 업데이트 (예: totalSituationCount 초기화)
  await stateRef.set(
    { lastSeasonReportAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );

  return reportText;
}


