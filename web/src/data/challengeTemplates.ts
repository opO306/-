import { ChallengeTemplate } from "../types/challenge";

export const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  {
    id: "fame-rush-easy",
    tags: ["fame", "speed"],
    baseGoal: { type: "fame", value: 10000 },
    modifiers: [{ type: "timeLimit", value: 300 }], // 5분
    difficultyWeight: 1,
    rewardCurve: { base: 50, perDifficulty: 10 },
  },
  {
    id: "expedition-master-medium",
    tags: ["expedition", "combat"],
    baseGoal: { type: "expeditionClear", value: 3 },
    modifiers: [{ type: "enemyTier", value: 3 }],
    difficultyWeight: 3,
    rewardCurve: { base: 100, perDifficulty: 20 },
  },
  {
    id: "level-up-hard",
    tags: ["leveling", "progression"],
    baseGoal: { type: "reachLevel", value: 5 },
    modifiers: [{ type: "debuff", value: 0.2 }], // XP 획득량 20% 감소
    difficultyWeight: 5,
    rewardCurve: { base: 200, perDifficulty: 40 },
  },
];

