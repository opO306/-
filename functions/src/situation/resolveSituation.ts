import { db } from "../index";
import * as admin from "firebase-admin";
import { ButterflyMark } from "../types/butterfly";
import { evaluateThresholds } from "../butterfly/evaluateThreshold";
import { suggestInitialJob } from "../job/suggestJob";
import { classifyIntent } from "../ai/intentClassifier";
import { generateSeasonReport } from "../season/generateSeasonReport";

export async function resolveSituationChoice(
  uid: string,
  choiceId: string,
  intentText?: string
) {
  const stateRef = db.doc(`playerState/${uid}`);
  const logsRef = db.collection(`playerSituations/${uid}/logs`);
  const butterflyRef = db.doc(`playerButterfly/${uid}`);

  await db.runTransaction(async (tx) => {
    const stateSnap = await tx.get(stateRef);
    const state = stateSnap.exists ? stateSnap.data()! : {};

    const prevChain = state.situationChainDepth ?? 0;
    const nextChainDepth =
      choiceId === "observe" ? prevChain + 1 : 0;

    // 1️⃣ 상황 로그
    tx.set(logsRef.doc(), {
      choiceId,
      situationText: "ai_or_fallback",
      chainIndex: prevChain,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 2️⃣ 상태 업데이트
    const isFirst = !state.firstJobSuggested;
    let jobSuggestion: string | null = null;
    let totalSituationCount = (state.totalSituationCount ?? 0) + 1; // 총 상황 횟수 증가

    let consecutiveChoiceCount = (state.lastChoiceId === choiceId)
      ? (state.consecutiveChoiceCount ?? 0) + 1
      : 1;
    let deltaWeight = 1;
    if (consecutiveChoiceCount >= 3) {
      deltaWeight = 0.7;
    }

    if (isFirst) {
      jobSuggestion = suggestInitialJob(choiceId);

      tx.set(
        stateRef,
        {
          situationChainDepth: nextChainDepth,
          lastSituationAt: admin.firestore.FieldValue.serverTimestamp(),
          firstExplorationDone: true,
          firstJobSuggested: true,
          totalSituationCount: totalSituationCount,
          lastChoiceId: choiceId,
          consecutiveChoiceCount: consecutiveChoiceCount,
        },
        { merge: true }
      );
    } else {
      tx.set(
        stateRef,
        {
          situationChainDepth: nextChainDepth,
          lastSituationAt: admin.firestore.FieldValue.serverTimestamp(),
          firstExplorationDone: true,
          totalSituationCount: totalSituationCount,
          lastChoiceId: choiceId,
          consecutiveChoiceCount: consecutiveChoiceCount,
        },
        { merge: true }
      );
    }

    // 3️⃣ Butterfly Mark (아직 효과 없음)
    const marks: ButterflyMark[] = [];

    if (choiceId === "observe" && prevChain >= 1) {
      marks.push({
        key: "observed_repeatedly",
        weight: 1 * deltaWeight,
        at: admin.firestore.FieldValue.serverTimestamp() as any,
      });
    }

    if (choiceId === "intervene") {
      marks.push({
        key: "ignored_risk",
        weight: 1 * deltaWeight,
        at: admin.firestore.FieldValue.serverTimestamp() as any,
      });
    }

    if (intentText && intentText.length > 2) {
      try {
        const intent = await classifyIntent(intentText);

        if (intent === "curious") {
          marks.push({
            key: "curiosity_expressed",
            weight: 1 * deltaWeight,
            at: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      } catch {
        // 조용히 무시
      }
    }

    if (marks.length > 0) {
      tx.set(
        butterflyRef,
        {
          marks: admin.firestore.FieldValue.arrayUnion(...marks),
        },
        { merge: true }
      );
    }

    const butterflySnap = await tx.get(butterflyRef);
    const butterfly = butterflySnap.exists ? butterflySnap.data()! : {
      marks: [],
      triggeredThresholds: [],
    };

    const newlyTriggered = evaluateThresholds(
      butterfly.marks ?? [],
      butterfly.triggeredThresholds ?? []
    );

    if (newlyTriggered.length > 0) {
      tx.set(
        butterflyRef,
        {
          triggeredThresholds: admin.firestore.FieldValue.arrayUnion(
            ...newlyTriggered
          ),
        },
        { merge: true }
      );
    }

    // 4️⃣ 시즌 종료 트리거 (임시)
    let seasonReportText: string | null = null;
    if (totalSituationCount % 30 === 0) {
      seasonReportText = await generateSeasonReport(uid);
      // 시즌 리포트 생성 후 totalSituationCount 초기화 또는 시즌 번호 업데이트 등 추가 로직 필요
      tx.set(
        stateRef,
        { totalSituationCount: 0, currentSeason: (state.currentSeason ?? 0) + 1 },
        { merge: true }
      );
    }

    return {
      resultText:
        choiceId === "observe"
          ? "당신은 상황을 지켜보기로 했다.""
          : "당신은 개입을 선택했다.",
      continue: true,
      jobSuggestion,
      seasonReportText,
    };
  });
}

