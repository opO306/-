import { MemoryTone } from "../game/npcMemory";

interface ClassifyIntentResult {
  tone: MemoryTone;
  reactionText: string;
}

import { NPCMemory } from "../game/npcMemory";
import { getDominantTone } from "../freeChoice/toMemory";

export function classifyIntent(text: string, memories: NPCMemory[]): ClassifyIntentResult {
  const { tone: dominantTone, strength: dominantStrength } = getDominantTone(memories);

  let tone: MemoryTone;
  let reactionText: string;

  // 반응의 강도를 조절하는 함수 (예시)
  const adjustReaction = (baseReaction: string, opposingTone: MemoryTone) => {
    if (dominantTone === opposingTone && dominantStrength >= 0.6) {
      return `(강한 ${opposingTone}) ${baseReaction} 그럼에도 불구하고...`;
    } else if (dominantTone === opposingTone && dominantStrength >= 0.2) {
      return `(${opposingTone}) ${baseReaction} 하지만 여전히...`;
    }
    return baseReaction;
  };

  if (text.includes("미소")) {
    tone = "trust";
    reactionText = adjustReaction("칼리는 당신의 미소에 작게 웃었다.", "fear");
  } else if (text.includes("무시")) {
    tone = "distance";
    reactionText = "칼리는 당신의 무시에 시선을 돌렸다.";
  } else if (text.includes("위협")) {
    tone = "fear";
    reactionText = adjustReaction("칼리는 당신의 위협에 두려워했다.", "trust");
  } else if (text.includes("칭찬")) {
    tone = "respect";
    reactionText = adjustReaction("칼리는 당신의 칭찬에 뿌듯해했다.", "resentment");
  } else if (text.includes("비난")) {
    tone = "resentment";
    reactionText = adjustReaction("칼리는 당신의 비난에 불쾌해했다.", "respect");
  } else {
    tone = "distance";
    reactionText = "칼리는 당신의 행동에 아무런 반응을 보이지 않았다.";
  }

  return { tone, reactionText };
}

