// functions/config/aiFlags.ts
export type AIStatus = {
  enabled: boolean;
  fallbackOnly: boolean;
  dailyLimit: number; // 일일 AI 호출 제한
  dailyTokenCap?: number; // 일일 토큰 사용 제한 (선택 사항)
  failureRateThreshold?: number; // 실패율 임계값 (0~1)
};
