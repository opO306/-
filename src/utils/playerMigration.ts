import * as tierMap from "../../migrate/tierToJobTitle.json";
import { PlayerState } from "../types/player";

// userDoc 타입은 실제 Firestore 문서 타입에 따라 조정될 수 있습니다.
interface UserDoc extends PlayerState {
  ref: { update: (data: Partial<PlayerState & { feature: { newJobSystem: boolean } }>) => Promise<void> };
  tierName: string;
  feature?: { newJobSystem?: boolean };
}

export async function ensureNewJob(userDoc: UserDoc) {
  if (!userDoc.feature?.newJobSystem) {
    const map = tierMap[userDoc.tierName as keyof typeof tierMap];
    if (!map) {
      console.warn(`No mapping found for tierName: ${userDoc.tierName}`);
      return;
    }
    await userDoc.ref.update({
      jobId: map.job,
      titleId: map.title,
      compositeId: map.composite || null,
      feature: { ...userDoc.feature, newJobSystem: true }
    });
  }
}
