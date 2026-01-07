// 이 파일에서 `db`와 `admin`은 Firebase Firestore 인스턴스 및 Firebase Admin SDK라고 가정합니다.
// 실제 사용 시에는 프로젝트 설정에 따라 `db`와 `admin`을 적절하게 초기화해야 합니다.
// 예: import { db } from "../path/to/firebase-admin-init";
// 예: import * as admin from 'firebase-admin';

import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { TriggeredOutcome } from "@/butterfly/evaluateThresholds";

const db = getFirestore();

// 이 함수는 세계 상태를 변경하는 실제 로직을 포함해야 합니다.
// 플레이어의 데이터나 게임 상태에 따라 다양한 방식으로 구현될 수 있습니다.
async function applyOutcomeToWorld(uid: string, outcome: any) {
  console.log(`Applying outcome to world for user ${uid}:`, outcome);
  // 여기에 outcome.type에 따라 실제 세계 변화 로직을 구현합니다.
  // 예를 들어:
  // if (outcome.type === "unlock_event_pool") {
  //   await db.doc(`playerWorldState/${uid}`).update({ unlockedEventPools: FieldValue.arrayUnion(outcome.value) });
  // }
  // else if (outcome.type === "modify_outcome_bias") {
  //   await db.doc(`playerWorldState/${uid}`).update({ [`outcomeBias.${outcome.value.axis}`]: outcome.value.bias });
  // }
}

export async function applyButterflyOutcomes(
  uid: string,
  triggered: TriggeredOutcome[]
) {
  const ref = db.doc(`playerButterfly/${uid}`);

  for (const t of triggered) {
    await applyOutcomeToWorld(uid, t.outcome);
  }

  await ref.update({
    triggeredThresholds: FieldValue.arrayUnion(
      ...triggered.map((t) => t.thresholdId)
    ),
  });
}

