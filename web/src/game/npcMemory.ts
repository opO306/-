export type MemoryTone =
  | "trust"
  | "fear"
  | "distance"
  | "resentment"
  | "respect";

export interface NPCMemory {
  text?: string; // 원래 NPCMemory에 text 속성이 있었지만, cause로 대체될 수 있습니다.
  npcId: string;
  tone: MemoryTone;
  cause: string; // NPCMemory에 cause 속성 추가
  strength: number; // 1~3
  turn: number; // NPCMemory에 turn 속성 추가
}

export function getDominantTone(memories: NPCMemory[]) {
  if (memories.length === 0) return null;

  return memories.reduce((a, b) =>
    a.strength >= b.strength ? a : b
  ).tone;
}

export async function requestNPCMemorySentence(input: {
  playerRole: string;
  behaviorSummary: string;
  npcDisposition: string;
}) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content: `
YouYou write exactly ONE remembered sentence from an NPC's perspective.

Rules:
- ONE sentence only.
- Do NOT mention events, places, or dates.
- Do NOT judge morally.
- Describe how the NPC perceives the player over time.
Tone: subtle, indirect, human.
          `.trim()
        },
        {
          role: "user",
          content: JSON.stringify(input)
        }
      ]
    })
  });

  const data = await res.json();
  return data.choices[0].message.content.trim() as string;
}
