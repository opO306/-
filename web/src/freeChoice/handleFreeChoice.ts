
import type { NPCMemory } from "../memory/npcMemory";

export async function handleFreeChoice(
  npcId: string,
  memories: NPCMemory[],
  turn: number,
  userChoice: string
): Promise<{ outcome: string; memory: NPCMemory; summary: string }> {
  // 이 함수는 AI 호출 또는 다른 로직을 통해 실제 응답을 생성해야 합니다.
  // 현재는 임시 응답을 반환합니다.
  console.log(`Handling free choice for NPC: ${npcId}, Turn: ${turn}, User choice: ${userChoice}`);
  console.log("Current NPC Memories:", memories);

  return {
    outcome: `[${npcId}] ${userChoice}에 대한 임시 응답입니다. (턴: ${turn})`,
    memory: { cause: userChoice, effect: "임시 효과", tone: "neutral" },
    summary: "임시 요약"
  };
}
