import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
admin.initializeApp();

/**
 * 매일 새로운 챌린지를 생성하고 Firestore에 저장합니다.
 * UTC 05:00 (KST 14:00)에 실행되도록 스케줄링됩니다.
 */
export const genChallengesDaily = onSchedule({
    schedule: "0 5 * * *", // 매일 UTC 05:00
    timeZone: "Asia/Seoul", // 한국 시간대에 맞춰 KST 14:00
  }, async () => {
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
      return;
    }

    // 이 부분은 임시 구현이며, 실제 챌린지 생성 로직이 필요합니다.
    // 현재는 빈 배열을 반환하도록 합니다.
    const generatedChallenges: any[] = []; // 임시 타입

    await dailyChallengesRef.set({ challenges: generatedChallenges });

    console.log(`Daily challenges for ${dailyDocId} generated successfully.`);
    return; // 명시적으로 void 반환
  });

