export type ExpeditionDef = {
  id: string;
  label: string;
  duration: number;       // ms
  fameCost: number;       // plain number for simplicity
  fameRewardPct: number;  // % of current Fame (e.g., 0.05 = +5%)
  alignmentDelta: number; // -10 ~ +10
};

export const EXPEDITIONS: ExpeditionDef[] = [
  {
    id: "dungeon-basic",
    label: "초급 던전 조사",
    duration: 5 * 60 * 1000, // 5 min
    fameCost: 1000,
    fameRewardPct: 0.05,
    alignmentDelta: 0,
  },
  {
    id: "city-pickpocket",
    label: "도심 소매치기",
    duration: 10 * 60 * 1000,
    fameCost: 2000,
    fameRewardPct: 0.07,
    alignmentDelta: -10,
  },
  {
    id: "sanctuary-guard",
    label: "성역 수호",
    duration: 30 * 60 * 1000,
    fameCost: 5000,
    fameRewardPct: 0.1,
    alignmentDelta: +15,
  },
];

export function getExpedition(id: string) {
  return EXPEDITIONS.find((e) => e.id === id)!;
}