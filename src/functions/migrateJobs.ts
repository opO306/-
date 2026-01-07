/* eslint-disable */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

import * as tierMap from "../../migrate/tierToJobTitle.json";

export const migrateJobs = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async () => {
    const db = admin.firestore();
    const snap = await db.collection('players')
      .where('feature.newJobSystem', '!=', true)
      .limit(500)            // 500 명씩 점진
      .get();

    const batch = db.batch();
    snap.docs.forEach(doc => {
      const old = doc.data() as any;
      const map = tierMap[old.tierName as keyof typeof tierMap];
      if (!map) {
        console.warn(`No mapping found for tierName: ${old.tierName}`);
        return;
      }      // 예외 기록
      batch.update(doc.ref, {
        jobId: map.job,
        titleId: map.title,
        compositeId: map.composite || null,
        feature: { ...old.feature, newJobSystem: true }
      });
    });
    await batch.commit();
  });
