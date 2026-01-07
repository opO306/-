import * as admin from "firebase-admin";
import { Title } from "../types/game";
import { generateAchievementsForTitle } from "../achievement/generateAchievements";

export async function selectTitleForRebirth(
  butterflyMarks: { key: string; weight: number }[],
  ownedTitleIds: string[]
): Promise<Title> {
  // 예시 로직: observed_repeatedly 마크가 있고, curiosity_expressed 마크가 있으면 '기록광' 칭호 부여
  const observedWeight = butterflyMarks
    .filter((m) => m.key === "observed_repeatedly")
    .reduce((sum, m) => sum + m.weight, 0);
  const curiosityWeight = butterflyMarks
    .filter((m) => m.key === "curiosity_expressed")
    .reduce((sum, m) => sum + m.weight, 0);

  let selectedTitleId: string = "wanderer"; // 기본 칭호
  let selectedTitleName: string = "방랑자";
  let selectedTitleTags: string[] = ["wanderer"];

  if (observedWeight >= 5 && curiosityWeight >= 3) {
    selectedTitleId = "record_keeper";
    selectedTitleName = "기록광";
    selectedTitleTags = ["observer", "curious", "collector"];
  } else if (observedWeight >= 3) {
    selectedTitleId = "observer";
    selectedTitleName = "관찰자";
    selectedTitleTags = ["observer"];
  } else if (curiosityWeight >= 2) {
    selectedTitleId = "curious_one";
    selectedTitleName = "호기심_많은_자";
    selectedTitleTags = ["curious"];
  }

  // 이미 소유한 칭호라면 다른 칭호를 선택하거나, 임시로 동일 칭호 재부여 (추후 확장)
  // 실제 게임에서는 칭호 풀에서 다음 후보를 찾거나, 더 복잡한 로직이 필요함
  if (ownedTitleIds.includes(selectedTitleId)) {
    // 임시로 다른 칭호를 반환 (개발용)
    const potentialTitles = [
      { id: "seeker", name: "탐색자", tags: ["seeker"] },
      { id: "adventurer", name: "모험가", tags: ["explorer", "risk"] },
      { id: "dreamer", name: "몽상가", tags: ["detached", "imaginative"] },
    ];
    const availableTitles = potentialTitles.filter(t => !ownedTitleIds.includes(t.id));
    if (availableTitles.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableTitles.length);
      selectedTitleId = availableTitles[randomIndex].id;
      selectedTitleName = availableTitles[randomIndex].name;
      selectedTitleTags = availableTitles[randomIndex].tags;
    } else {
      // 더 이상 줄 칭호가 없으면 기본 칭호 반환
      selectedTitleId = "wanderer";
      selectedTitleName = "방랑자";
      selectedTitleTags = ["wanderer"];
    }
  }

  const newTitle: Title = {
    id: selectedTitleId,
    label: selectedTitleName,
    tags: selectedTitleTags,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // Generate achievement for the newly acquired title
  await generateAchievementsForTitle(newTitle);

  return newTitle;
}

