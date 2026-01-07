import * as tierMap from "../../migrate/tierToJobTitle.json";
import { GameState } from "../app/providers/GameProvider";

// userDoc 타입은 실제 Firestore 문서 타입에 따라 조정될 수 있습니다.
interface UserDoc extends Omit<GameState, 'feature'> {
  ref: { update: (data: Partial<GameState>) => Promise<void> };
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
      currentJobId: (map as any).jobId, // GameState 타입에 jobId가 없을 경우 임시 처리
      currentTitleId: map.titleId,
      compositeId: (map as any).compositeId || null,
      feature: { ...userDoc.feature, newJobSystem: true }
    });
  }
}
