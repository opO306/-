import { NPCMemory } from "../../src/game/npcMemory"; // 새로 추가된 NPCMemory 임포트 경로

export function buildSituationPrompt(input: {
  currentJob: string;
  worldMood: string;
  npcMemories: NPCMemory[];
  lastChoice: string;
}) {
  return `You generate open-ended, immersive situations for a user navigating a simulated world.

Guidelines:
- Describe the current situation concisely (1~2 lines)
- Do not explain outcomes or choices
- Do not label anything as a game
- Use grounded, natural language
- Avoid fantasy/heroic exaggeration

If NPCs are involved, make their tone and past behavior consistent with prior memories.

Inject subtle consequences of the user's past decisions (if any), but let the user interpret them.

Keep your tone neutral and immersive.

---

USER 예시 입력:
{
  "currentJob": "${input.currentJob}",
  "worldMood": "${input.worldMood}",
  "npcMemories": [
    ${input.npcMemories
      .map(
        (m) =>
          `{ "npcId": "${m.npcId}", "tone": "${m.tone}", "cause": "${m.cause}", "strength": ${m.strength}, "turn": ${m.turn} }`
      )
      .join(",\n    ")}
  ],
  "lastChoice": "${input.lastChoice}"
}

---

기대 출력 예시:
칼리는 다시 마을 앞에 나와 있었다.
당신을 보자 잠깐 주춤했지만, 아무 말 없이 기다리고 있다.

당신은?
`;
}

