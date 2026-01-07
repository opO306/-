import { onCall } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { createSituationText } from "./situation/createSituation";
import { resolveSituationChoice } from "./situation/resolveSituation";
import { collectThresholdMetrics } from "./cron/thresholdMetrics";
import { collectContentMetrics } from "./ops/contentMetrics";
import { adjustThresholds } from "./cron/adjustThresholds";
import { generateCompositeJob } from "./job/compositeJob";
import { generateSynthesizedTitle } from "./title/synthesis";

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

export const updatePlayerJobAndTitle = onCall(
  { region: "asia-northeast3" },
  async (req) => {
    const uid = req.auth?.uid;
    const { baseJobId, activeTitleId } = req.data;

    if (!uid) throw new Error("unauthenticated");
    if (!baseJobId) throw new Error("invalid-argument: baseJobId missing");
    if (!activeTitleId) throw new Error("invalid-argument: activeTitleId missing");

    const playerStateRef = db.doc(`playerState/${uid}`);

    await db.runTransaction(async (transaction) => {
      const playerStateSnap = await transaction.get(playerStateRef);
      if (!playerStateSnap.exists) {
        throw new Error("player-state-not-found");
      }

      const compositeJob = generateCompositeJob(baseJobId, activeTitleId);

      transaction.set(
        playerStateRef,
        {
          baseJobId: baseJobId,
          activeTitleId: activeTitleId,
          compositeJobId: compositeJob.id,
          compositeJobName: compositeJob.name,
          compositeJobToneTags: compositeJob.toneTags,
          lastJobTitleUpdateAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    });

    return { success: true };
  }
);

export const synthesizeTitles = onCall(
  { region: "asia-northeast3" },
  async (req) => {
    const uid = req.auth?.uid;
    const { titleAId, titleBId } = req.data;

    if (!uid) throw new Error("unauthenticated");
    if (!titleAId || !titleBId) throw new Error("invalid-argument: missing title IDs");

    const playerStateRef = db.doc(`playerState/${uid}`);
    const playerTitlesCollectionRef = db.collection(`playerTitles/${uid}/titles`);

    await db.runTransaction(async (transaction) => {
      const playerStateSnap = await transaction.get(playerStateRef);
      if (!playerStateSnap.exists) {
        throw new Error("player-state-not-found");
      }
      const playerState = playerStateSnap.data()!;

      // Check if season has ended (or not in progress)
      // For now, simply check if totalSituationCount is 0 (after a season reset)
      if ((playerState.totalSituationCount ?? 0) !== 0) {
        throw new Error("synthesis-not-allowed-during-season");
      }

      // Check if player owns the titles
      const ownedTitleIds: string[] = playerState.ownedTitleIds ?? [];
      if (!ownedTitleIds.includes(titleAId) || !ownedTitleIds.includes(titleBId)) {
        throw new Error("player-does-not-own-one-or-both-titles");
      }

      const [titleASnap, titleBSnap] = await Promise.all([
        playerTitlesCollectionRef.doc(titleAId).get(),
        playerTitlesCollectionRef.doc(titleBId).get(),
      ]);

      if (!titleASnap.exists || !titleBSnap.exists) {
        throw new Error("one-or-both-titles-not-found-in-collection");
      }

      const titleA = titleASnap.data()! as Title;
      const titleB = titleBSnap.data()! as Title;

      const existingTitlesSnaps = await playerTitlesCollectionRef.get();
      const existingTitleIds = existingTitlesSnaps.docs.map(doc => doc.id);

      const newTitle = await generateSynthesizedTitle(titleA, titleB, existingTitleIds);

      // Add new title to ownedTitleIds and playerTitles collection
      transaction.set(playerTitlesCollectionRef.doc(newTitle.id), newTitle);
      transaction.update(
        playerStateRef,
        { ownedTitleIds: admin.firestore.FieldValue.arrayUnion(newTitle.id) }
      );

      // Optionally, set the new title as active or clear activeTitleId if desired
      // For now, we just add it to the collection
    });

    return { success: true };
  }
);

export const suggestUserTitle = onCall(
  { region: "asia-northeast3" },
  async (req) => {
    const uid = req.auth?.uid;
    const { suggestedName } = req.data;

    if (!uid) throw new Error("unauthenticated");
    if (!suggestedName) throw new Error("invalid-argument: suggestedName missing");

    const success = await suggestUserTitleLogic(uid, suggestedName);

    return { success };
  }
);

