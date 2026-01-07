import * as admin from "firebase-admin";
import { db } from "../index";
import { createHash } from 'crypto';

const CONTENT_METRICS_DOC_REF = db.doc("metrics/content");

function hashText(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

export async function collectContentMetrics() {
  const twentyFourHoursAgo = admin.firestore.Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000);

  const allSituationLogs = await db.collectionGroup("logs")
    .where("createdAt", ">=", twentyFourHoursAgo)
    .get();

  const hashes: string[] = [];
  const uniqueHashes = new Set<string>();

  allSituationLogs.forEach(doc => {
    const data = doc.data();
    if (data.situationText) {
      const hashedText = hashText(data.situationText);
      hashes.push(hashedText);
      uniqueHashes.add(hashedText);
    }
  });

  const duplicationRate = hashes.length > 0 ? (hashes.length - uniqueHashes.size) / hashes.length : 0;

  await CONTENT_METRICS_DOC_REF.set({
    duplicationRate,
    totalSituations: hashes.length,
    uniqueSituations: uniqueHashes.size,
    at: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
}

export async function getDuplicationRate(): Promise<number> {
  const snap = await CONTENT_METRICS_DOC_REF.get();
  if (snap.exists) {
    return snap.data()?.duplicationRate ?? 0;
  }
  return 0;
}

