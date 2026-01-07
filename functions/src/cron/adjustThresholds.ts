import * as admin from "firebase-admin";
import { db } from "../index";

const THRESHOLDS_DOC_REF = db.doc("system/thresholds");
const METRICS_THRESHOLDS_DOC_REF = db.doc("metrics/thresholds");

export async function adjustThresholds() {
  const [thresholdsSnap, metricsSnap] = await Promise.all([
    THRESHOLDS_DOC_REF.get(),
    METRICS_THRESHOLDS_DOC_REF.get(),
  ]);

  if (!thresholdsSnap.exists || !metricsSnap.exists) {
    console.log("Thresholds or metrics data not found. Skipping adjustment.");
    return;
  }

  const thresholdsData = thresholdsSnap.data()!;
  const metricsData = metricsSnap.data()!;

  const currentThresholds = thresholdsData.thresholds as {
    id: string;
    requiredKey: string;
    minWeight: number;
    worldFlag: string;
  }[];

  const totalUsers = metricsData.users ?? 0;
  const triggeredCounts = metricsData.counts ?? {};

  const updatedThresholds = currentThresholds.map((t) => {
    const triggeredCount = triggeredCounts[t.id] ?? 0;
    const rate = totalUsers > 0 ? triggeredCount / totalUsers : 0;

    let newMinWeight = t.minWeight;

    if (rate > 0.45) {
      newMinWeight = Math.min(newMinWeight + 1, 10); // 상한선 10 (임의)
    } else if (rate < 0.25) {
      newMinWeight = Math.max(newMinWeight - 1, 2); // 하한선 2
    }

    return { ...t, minWeight: newMinWeight };
  });

  await THRESHOLDS_DOC_REF.set({ thresholds: updatedThresholds }, { merge: true });
  console.log("Thresholds adjusted successfully.");
}

