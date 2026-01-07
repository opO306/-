import { onCall, CallableRequest, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
admin.initializeApp();

import { SituationGenInput } from "../../src/types/situation";
import { JOBS } from "../data/jobs"; // JOBS 임포트

// AI 서비스 레이어에서 가져오기
import { createSituation } from "../../functions/services/situationService";

export const genSituation = onCall(async (request: CallableRequest<{ input: SituationGenInput; currentJobId?: string }>) => {
  const { data, auth } = request;

  if (!auth) {
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }

  const { input, currentJobId } = data;
  // AI 서비스 레이어를 통해 상황 생성
  const result = await createSituation({ ...input, jobTags: currentJobId ? JOBS[currentJobId].tags : [] });

    if (result.source === "ai") {
      // TODO: getDailyCallCount 업데이트 로직 (성공 시)
    }

    // TODO: 선택지 Rule 기반 생성 로직과 연동하여 실제 선택지 반환 (이전 체크리스트 B4)
    return { situationText: result.text, options: ["관찰한다", "개입한다"], source: result.source, model: result.model };
  }
);
