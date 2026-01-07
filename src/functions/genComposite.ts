import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

import { Job } from "../types/job";
import { Title } from "../types/title";
import { ArchetypeVector } from "../data/archetypeAxes";
import Decimal from "break_infinity.js";

// 가상의 LLM 응답 시뮬레이션
async function callLLM(prompt: string): Promise<Array<{ name: string; bonus: { [key: string]: Decimal } }>> {
  console.log("Calling LLM with prompt:", prompt);
  // 실제 LLM API 호출 로직은 여기에 구현됩니다.
  // 이 예시에서는 가상의 응답을 반환합니다.
  return [
    { name: "가상의 파생직업 1", bonus: { famePerSec: new Decimal(0.1), xpBonus: new Decimal(0.05) } },
    { name: "가상의 파생직업 2", bonus: { famePerSec: new Decimal(0.08), goldBonus: new Decimal(0.1) } },
    { name: "가상의 파생직업 3", bonus: { xpBonus: new Decimal(0.07), discoveryChance: new Decimal(0.03) } },
  ];
}

// 가상의 Moderation 필터링
function moderateText(text: string): boolean {
  // 금칙어, 혐오 표현 필터링 로직
  return !text.includes("나쁜말"); // 예시
}

/**
 * 파생 직업을 생성합니다.
 * @param job 기본 직업 정보
 * @param title 칭호 정보
 * @param archetype 플레이어의 성향 벡터
 * @returns 생성된 파생 직업 정보 (이름, 보너스)
 */
export const genComposite = functions.https.onCall(
  async (data: { job: Job; title: Title; archetype: ArchetypeVector }, context) => {
    // 인증 확인 (선택 사항)
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }

    const { job, title, archetype } = data;

    // 1. Rule Engine: (job.tag, title.tag) ↦ 프롬프트 스켈레톤 선택
    let promptSkeleton = `직업 '${job.name}' (태그: ${job.tag})과 칭호 '${title.label}' (태그: ${title.tag})의 조합에 어울리는 새로운 파생 직업의 이름과 보너스를 3가지 제안해주세요. 플레이어의 성향은 ${JSON.stringify(archetype)}입니다.`;
    // TODO: 실제 태그 기반 규칙 및 프롬프트 스켈레톤 로직 구현

    // 2. LLM 호출
    let llmCandidates = await callLLM(promptSkeleton);

    // 3. Moderation 및 재생성 루프
    let moderatedCandidates = llmCandidates.filter(c => moderateText(c.name));
    // TODO: Moderation 실패 시 재생성 루프 구현

    // 4. Clamp: 보너스 합계 25 % 이하 자동 스케일
    moderatedCandidates = moderatedCandidates.map(candidate => {
      const totalBonusPct = Object.values(candidate.bonus).reduce((sum, val) => sum.plus(val), new Decimal(0));
      if (totalBonusPct.gt(0.25)) {
        const scaleFactor = new Decimal(0.25).div(totalBonusPct);
        const scaledBonus: { [key: string]: Decimal } = {};
        for (const key in candidate.bonus) {
          scaledBonus[key] = candidate.bonus[key].mul(scaleFactor);
        }
        return { ...candidate, bonus: scaledBonus };
      }
      return candidate;
    });

    // 5. 캐시: (jobId,titleId,archeHash) → compositeId 고정
    // TODO: 실제 캐싱 로직 구현 (Firestore 등 사용)
    const archeHash = JSON.stringify(archetype); // 임시 해시
    const compositeId = `${job.id}_${title.id}_${archeHash}`; // 임시 ID

    return {
      compositeId,
      candidates: moderatedCandidates,
    };
  }
);

