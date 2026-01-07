/* eslint-disable */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
import Decimal from "break_infinity.js";
import { ArchetypeVector } from "../data/archetypeAxes";
import { SessionMetrics } from "../types/metrics";

function calcArchetype(metrics: SessionMetrics): ArchetypeVector {
  const orderChaos = metrics.prestigeGapMin / 60; // 예시: 60분 간격으로 정규화
  const totalStaySec = metrics.stayResearchSec + metrics.stayExpeditionSec + 1;
  const altruismSelf = (metrics.stayResearchSec - metrics.stayExpeditionSec) / totalStaySec; // 연구 vs 탐험 체류 비율
  const asceticHedon = metrics.highRiskExpeditions > 0 ? 1 : -1; // 고위험 탐험 시도 횟수 (임시)
  const researchCost = new Decimal(metrics.researchCost);
  const upgradeCost = new Decimal(metrics.upgradeCost);
  
  let knowledgeDestruction = 0;
  if (upgradeCost.gt(0)) {
    knowledgeDestruction = researchCost.plus(1).log10() / upgradeCost.plus(1).log10();
  } else if (researchCost.gt(0)) {
    knowledgeDestruction = 1; // 업그레이드 비용이 없으면 연구 비용이 높다고 가정
  } else {
    knowledgeDestruction = 0; // 둘 다 없으면 중립
  }

  return {
    orderChaos: Math.min(1, Math.max(-1, orderChaos)),
    altruismSelf: Math.min(1, Math.max(-1, altruismSelf)),
    asceticHedon: Math.min(1, Math.max(-1, asceticHedon)),
    knowledgeDestruction: Math.min(1, Math.max(-1, knowledgeDestruction)),
  };
}

/** HTTP endpoint: /pulse  POST  { uid, metrics }
 *  Merges session metrics into Firestore and updates archetype.
 */
export const pulse = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const { uid, metrics } = req.body as { uid: string; metrics: SessionMetrics };
  if (!uid || !metrics) return res.status(400).end();

  const userRef = admin.firestore().doc(`players/${uid}`);
  await admin.firestore().runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    const prev = snap.data() || {};
    const merged = {
      metrics: {
        ...(prev.metrics || {}),
        // naive merge; production would sum numeric fields properly
        clicks: (prev.metrics?.clicks || 0) + metrics.clicks,
        stayResearchSec: (prev.metrics?.stayResearchSec || 0) + metrics.stayResearchSec,
        stayExpeditionSec: (prev.metrics?.stayExpeditionSec || 0) + metrics.stayExpeditionSec,
        highRiskExpeditions: (prev.metrics?.highRiskExpeditions || 0) + metrics.highRiskExpeditions,
        researchCost: new Decimal(prev.metrics?.researchCost || 0).add(metrics.researchCost).toString(),
        upgradeCost: new Decimal(prev.metrics?.upgradeCost || 0).add(metrics.upgradeCost).toString(),
        challengesCleared: (prev.metrics?.challengesCleared || 0) + metrics.challengesCleared,
        prestigeGapMin: metrics.prestigeGapMin, // overwrite with latest gap
      },
    };
    const archetype = calcArchetype(merged.metrics);
    tx.set(userRef, { metrics: merged.metrics, archetype }, { merge: true });
  });
  return res.json({ ok: true });
});
