import * as admin from "firebase-admin";

const AI_HEALTH_DOC_REF = admin.firestore().doc("metrics/aiHealth");

export async function getAIStatus() {
  const snap = await AI_HEALTH_DOC_REF.get();
  if (!snap.exists) {
    return { enabled: true, fallbackOnly: false, failureCount: 0, totalCount: 0 };
  }
  const data = snap.data()!;
  return {
    enabled: data.enabled ?? true,
    fallbackOnly: data.fallbackOnly ?? false,
    failureCount: data.failureCount ?? 0,
    totalCount: data.totalCount ?? 0,
  };
}

export async function setAIStatus(status: { enabled?: boolean; fallbackOnly?: boolean }) {
  await AI_HEALTH_DOC_REF.set(status, { merge: true });
}

export async function recordAIFailure() {
  await AI_HEALTH_DOC_REF.set(
    {
      failureCount: admin.firestore.FieldValue.increment(1),
      totalCount: admin.firestore.FieldValue.increment(1),
      lastFailureAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

export async function recordAISuccess() {
  await AI_HEALTH_DOC_REF.set(
    {
      totalCount: admin.firestore.FieldValue.increment(1),
    },
    { merge: true }
  );
}

export async function checkAndToggleAIFallback() {
  const aiStatus = await getAIStatus();
  const failureRate = aiStatus.totalCount > 0 ? aiStatus.failureCount / aiStatus.totalCount : 0;

  if (failureRate > 0.1) {
    await setAIStatus({ fallbackOnly: true });
  } else {
    await setAIStatus({ fallbackOnly: false });
  }

  // 1시간마다 메트릭 초기화 (크론 잡으로 대체될 수 있음)
  // const now = admin.firestore.FieldValue.serverTimestamp();
  // if (aiStatus.lastReset && (now.toMillis() - aiStatus.lastReset.toMillis() > 3600 * 1000)) {
  //   await AI_HEALTH_DOC_REF.set({ failureCount: 0, totalCount: 0, lastReset: now }, { merge: true });
  // }
}

