import * as admin from "firebase-admin";

export async function collectThresholdMetrics() {
  const snaps = await admin.firestore()
    .collectionGroup("playerButterfly")
    .get();

  const counts: Record<string, number> = {};
  const users = new Set<string>();

  snaps.forEach(s => {
    const d = s.data();
    users.add(s.id);
    (d.triggeredThresholds ?? []).forEach((t: string) => {
      counts[t] = (counts[t] ?? 0) + 1;
    });
  });

  await admin.firestore().doc("metrics/thresholds").set({
    users: users.size,
    counts,
    at: admin.firestore.FieldValue.serverTimestamp(),
  });
}

