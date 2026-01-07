import { onCall } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { createSituationText } from "./situation/createSituation";
import { resolveSituationChoice } from "./situation/resolveSituation";
import { collectThresholdMetrics } from "./cron/thresholdMetrics";
import { collectContentMetrics } from "./ops/contentMetrics";
import { adjustThresholds } from "./cron/adjustThresholds";

admin.initializeApp();
export const db = admin.firestore();

export const createSituation = onCall(
  { region: "asia-northeast3" },
  async (req) => {
    const uid = req.auth?.uid;
    if (!uid) throw new Error("unauthenticated");

    return await createSituationText(uid);
  }
);

export const resolveSituation = onCall(
  { region: "asia-northeast3" },
  async (req) => {
    const uid = req.auth?.uid;
    const { choiceId, intentText } = req.data;

    if (!uid) throw new Error("unauthenticated");
    if (!choiceId) throw new Error("invalid-argument");

    return await resolveSituationChoice(uid, choiceId, intentText);
  }
);

export const dailyThresholdMetrics = onSchedule(
  "every 24 hours",
  async (event) => {
    await collectThresholdMetrics();
  }
);

export const dailyContentMetrics = onSchedule(
  "every 24 hours",
  async (event) => {
    await collectContentMetrics();
  }
);

export const dailyAdjustThresholds = onSchedule(
  "every 24 hours",
  async (event) => {
    await adjustThresholds();
  }
);

