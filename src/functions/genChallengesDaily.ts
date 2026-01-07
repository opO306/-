import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

import { CHALLENGE_TEMPLATES } from "../data/challengeTemplates";
import { DailyChallengeInstance, ChallengeTemplate } from "../types/challenge";

// 가상의 LLM 응답 시뮬레이션
async function callLLMForFlavorText(template: ChallengeTemplate): Promise<string> {
  console.log("Calling LLM for flavor text with template:", template.id);
  // 실제 LLM API 호출 로직은 여기에 구현됩니다.
  // 이 예시에서는 가상의 응답을 반환합니다.
  return `챌린지 '${template.label || template.id}' (태그: ${template.tags.join(", ")})에 대한 흥미로운 이야기입니다. 목표: ${template.baseGoal.type} ${template.baseGoal.value}.`;
}

// 가상의 Moderation 필터링 (genComposite과 동일한 로직 사용 가능)
function moderateText(text: string): boolean {
  return !text.includes("나쁜말"); // 예시
}

/**
 * 매일 새로운 챌린지를 생성하고 Firestore에 저장합니다.
 * UTC 05:00 (KST 14:00)에 실행되도록 스케줄링됩니다.
 */
export const genChallengesDaily = functions.pubsub.schedule("0 5 * * *") // 매일 UTC 05:00
  .timeZone("Asia/Seoul") // 한국 시간대에 맞춰 KST 14:00
  .onRun(async (context) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dailyDocId = `${yyyy}${mm}${dd}`;

    const dailyChallengesRef = admin.firestore().collection("dailyChallenges").doc(dailyDocId);

    // 이미 생성된 챌린지가 있는지 확인
    const snapshot = await dailyChallengesRef.get();
    if (snapshot.exists) {
      console.log(`Daily challenges for ${dailyDocId} already exist. Skipping generation.`);
      return null;
    }

    const generatedChallenges: DailyChallengeInstance[] = [];

    // 1. 플레이어 세분화 버킷에 맞는 템플릿 3개 무작위 선택 (현재는 무작위 3개)
    const shuffledTemplates = CHALLENGE_TEMPLATES.sort(() => 0.5 - Math.random());
    const selectedTemplates = shuffledTemplates.slice(0, 3); // 상위 3개 선택

    for (const template of selectedTemplates) {
      // 2. LLM 프롬프트 스켈레톤으로 플레이버 텍스트 생성
      let flavorText = await callLLMForFlavorText(template);

      // 3. Moderation 통과
      if (!moderateText(flavorText)) {
        flavorText = "관리자에 의해 수정된 챌린지 설명입니다."; // 또는 재생성 루프
      }

      // 보상 계산 (여기서는 단순히 rewardCurve를 사용)
      const rewards = {
        prestigePoints: template.rewardCurve.base + template.difficultyWeight * template.rewardCurve.perDifficulty,
        relicShards: Math.floor((template.rewardCurve.base + template.difficultyWeight * template.rewardCurve.perDifficulty) / 10), // 임시 계산
        exclusiveTitle: Math.random() < 0.1 ? "희귀 칭호" : undefined, // 10% 확률로 희귀 칭호
      };

      generatedChallenges.push({
        ...template,
        generatedDate: dailyDocId,
        flavorText,
        rewards,
      });
    }

    // 4. `dailyChallenges/{yyyyMMdd}` 문서에 쓰기
    await dailyChallengesRef.set({ challenges: generatedChallenges });

    console.log(`Daily challenges for ${dailyDocId} generated successfully.`);
    return null;
  });

