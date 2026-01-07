export interface ChallengeTemplate {
  id: string;
  tags: string[];
  baseGoal: {
    type: string; // 구체적인 타입은 필요에 따라 확장
    value: number;
  };
  modifiers: Array<{
    type: string; // 구체적인 타입은 필요에 따라 확장
    value: number;
  }>;
  difficultyWeight: number;
  rewardCurve: {
    base: number;
    perDifficulty: number;
  };
}

export interface PlayerChallengeProgress {
  challengeId: string;
  currentProgress: number; // Decimal 대신 number 사용 (간소화)
  isCompleted: boolean;
  completionTime?: number;
}

export interface DailyChallengeInstance {
  id: string;
  templateId: string;
  difficulty: number;
  rewards: {
    prestigePoints: string; // Decimal을 string으로 저장
    relicShards: string; // Decimal을 string으로 저장
    fame: string; // Decimal을 string으로 저장
  };
}
