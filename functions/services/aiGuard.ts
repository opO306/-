// functions/services/aiGuard.ts
import * as admin from "firebase-admin";
admin.initializeApp();
import { AIStatus } from "../config/aiFlags";

// Firestore에서 AI 상태를 가져오는 함수 (시스템 설정)
async function getAIStatus(): Promise<AIStatus> {
  const doc = await admin.firestore().doc("system/aiStatus").get();
  if (doc.exists) {
    return doc.data() as AIStatus;
  }
  // 기본값 (AI 활성화, Fallback 아님, 일일 제한 50000)
  return { enabled: true, fallbackOnly: false, dailyLimit: 50000 };
}

// TODO: 유저별 AI 호출 횟수를 가져오는 함수 구현 (Firestore 등 연동 필요)
async function getTodayUsage(/* uid: string */): Promise<number> {
  console.warn("TODO: Implement getTodayUsage for actual daily AI call count.");
  return 0; // 임시 구현: 항상 0을 반환
}

// AI 사용 가능 여부를 판단하는 가드 함수
export async function canUseAI(): Promise<boolean> {
  const status = await getAIStatus();
  if (!status.enabled) return false;
  if (status.fallbackOnly) return false;

  const count = await getTodayUsage();
  return count < status.dailyLimit;
}

// TODO: AI 실패율 증가 시 AIStatus를 업데이트하는 함수 (markAIFailure)
// TODO: 비용 기준 자동 OFF 로직 구현 (logAIUsage)
