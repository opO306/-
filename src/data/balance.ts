/**
 * 게임 밸런스 상수
 */

// 레벨업 공식
export const XP_FOR_LEVEL = (level: number): number => {
  return Math.floor(100 * Math.pow(1.15, level - 1));
};

// 업그레이드 비용 공식
export const APS_UPGRADE_COST = (level: number): number => {
  return Math.floor(50 * Math.pow(1.2, level));
};

export const XP_UPGRADE_COST = (level: number): number => {
  return Math.floor(100 * Math.pow(1.25, level));
};

// 업그레이드 효과
export const APS_UPGRADE_MULTIPLIER = (level: number): number => {
  return 1 + level * 0.1; // 레벨당 +10%
};

export const XP_UPGRADE_MULTIPLIER = (level: number): number => {
  return 1 + level * 0.15; // 레벨당 +15%
};

// 기본값
export const INITIAL_APS = 1.0;
export const TICK_INTERVAL = 100; // 게임 루프 간격 (ms)

// 나비 효과 마크 최대 저장 개수
export const MAX_BUTTERFLY_MARKS = 10;

// 직업 제안 쿨타임 (ms)
export const JOB_SUGGESTION_COOLDOWN = 300000; // 5분

