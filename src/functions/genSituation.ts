import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

import { SituationGenInput } from "../types/situation";

// AI 서비스 레이어에서 가져오기
import { createSituation } from "../../functions/services/situationService";

export const genSituation = functions.https.onCall(
  async (data: { input: SituationGenInput; currentJobId?: string }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }

    const { input, currentJobId } = data;
    const uid = context.auth.uid; // 유저 ID 가져오기

    // AI 서비스 레이어를 통해 상황 생성
    const result = await createSituation({ ...input, jobTags: currentJobId ? JOBS[currentJobId].tags : [] }, uid); // input에 jobTags를 병합하여 전달

    if (result.source === "ai") {
      // TODO: getDailyCallCount 업데이트 로직 (성공 시)
    }

    // TODO: 선택지 Rule 기반 생성 로직과 연동하여 실제 선택지 반환 (이전 체크리스트 B4)
    return { situationText: result.text, options: ["관찰한다", "개입한다"], source: result.source, model: result.model };
  }
);
