import { Title } from "../types/title";

export function useVisibleTitles(
  all: Title[],
  currentId: string | null,
) {
  // 플레이어가 아직 Citizen(=tier0)이라면
  if (!currentId || all.find(t => t.id === currentId)?.tier === 0) {
    return all.filter(t => t.tier === 1);     // Tier1 목록
  }

  // 현재 칭호 객체
  const cur = all.find(t => t.id === currentId)!;

  // 다음 티어 후보
  const nextTier = cur.tier + 1;
  return all.filter(
    t => t.tier === nextTier && t.parentId === cur.id,
  );
}
