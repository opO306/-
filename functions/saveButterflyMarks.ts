// 이 파일에서 `db`는 Firebase Firestore 인스턴스라고 가정합니다. 
// 실제 사용 시에는 프로젝트 설정에 따라 `db`를 적절하게 초기화해야 합니다.
// 예: import { db } from "../path/to/firebase-admin-init";

import { ButterflyMark } from "@/types/butterfly";
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

const MAX_MARKS = 100;

export async function saveButterflyMarks(
  uid: string,
  newMarks: ButterflyMark[]
) {
  const ref = db.doc(`playerButterfly/${uid}`);
  const snap = await ref.get();

  const existing: ButterflyMark[] =
    snap.exists ? (snap.data() as { marks?: ButterflyMark[] }).marks ?? [] : [];

  const merged = [...existing, ...newMarks]
    .sort((a, b) => a.createdAt - b.createdAt)
    .slice(-MAX_MARKS);

  await ref.set({ marks: merged }, { merge: true });
}

