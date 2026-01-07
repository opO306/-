// functions/services/aiLogger.ts
import * as admin from "firebase-admin";

// TODO: AI 로그를 저장하는 Firestore 문서 경로 설정
const AI_LOG_COLLECTION = "aiLogs";

// TODO: 유저별 AI 일일 사용량 통계를 저장하는 Firestore 문서 경로 설정
const USER_USAGE_COLLECTION = "userAIDailyUsage";

/**
 * AI 호출 및 사용량을 기록합니다.
 * @param uid 사용자 ID
 * @param model 사용된 AI 모델
 * @param tokenEstimate 사용된 토큰 추정치
 * @param success 호출 성공 여부
 * @param errorMessage 오류 메시지 (실패 시)
 */
export async function logAIUsage(
  uid: string,
  model: string,
  tokenEstimate: number,
  success: boolean,
  errorMessage?: string
): Promise<void> {
  try {
    await admin.firestore().collection(AI_LOG_COLLECTION).add({
      uid,
      model,
      tokenEstimate,
      success,
      errorMessage: errorMessage ?? null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Error logging AI usage:", error);
  }
}

/**
 * 유저의 일일 AI 호출 횟수를 업데이트합니다.
 * @param uid 사용자 ID
 * @param increment 증가량 (보통 1)
 */
export async function updateDailyCallCount(uid: string, increment: number): Promise<void> {
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD 형식
    const docRef = admin.firestore().doc(`${USER_USAGE_COLLECTION}/${uid}/daily/${today}`);
    await docRef.set(
      {
        callCount: admin.firestore.FieldValue.increment(increment),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating daily call count:", error);
  }
}

/**
 * 유저의 일일 AI 토큰 사용량을 업데이트합니다.
 * @param uid 사용자 ID
 * @param increment 증가량 (토큰 수)
 */
export async function updateDailyTokenUsage(uid: string, increment: number): Promise<void> {
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD 형식
    const docRef = admin.firestore().doc(`${USER_USAGE_COLLECTION}/${uid}/daily/${today}`);
    await docRef.set(
      {
        tokenUsage: admin.firestore.FieldValue.increment(increment),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating daily token usage:", error);
  }
}

/**
 * AI 호출 실패율을 기록하고, 임계치를 초과하면 자동 Fallback 모드로 전환합니다.
 */
export async function markAIFailure(): Promise<void> {
  // TODO: 실제 실패율 계산 및 임계치 비교 로직 구현
  console.warn("TODO: Implement actual AI failure rate calculation and auto-fallback logic.");
  // 예시: 최근 N회 호출 중 실패 횟수를 기반으로 실패율 계산
  // const recentLogs = await admin.firestore().collection(AI_LOG_COLLECTION)
  //   .where('createdAt', '>', new Date(Date.now() - /* 쿨타임 */))
  //   .orderBy('createdAt', 'desc')
  //   .limit(100).get();
  // const failureCount = recentLogs.docs.filter(doc => !doc.data().success).length;
  // const failureRate = failureCount / recentLogs.size;
  // const status = await getAIStatus();
  // if (failureRate > status.failureRateThreshold) {
  //   await setAIStatus({ fallbackOnly: true });
  //   console.warn("AI automatically switched to fallback-only mode due to high failure rate.");
  // }
}

