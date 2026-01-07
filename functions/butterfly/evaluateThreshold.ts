import { db } from "../index";

const THRESHOLDS_DOC_REF = db.doc("system/thresholds");

export async function getThresholds(): Promise<Array<{ id: string; requiredKey: string; minWeight: number; worldFlag: string }>> {
  const snap = await THRESHOLDS_DOC_REF.get();
  if (snap.exists) {
    return snap.data()?.thresholds ?? [];
  }
  return [];
}

export async function evaluateThresholds(
  marks: { key: string; weight: number }[],
  triggered: string[]
) {
  const results: string[] = [];
  const THRESHOLDS = await getThresholds();

  for (const t of THRESHOLDS) {
    if (triggered.includes(t.id)) continue;

    const sum = marks
      .filter((m) => m.key === t.requiredKey)
      .reduce((a, b) => a + b.weight, 0);

    if (sum >= t.minWeight) {
      results.push(t.id);
    }
  }

  return results;
}

