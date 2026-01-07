import { NPCMemory, MemoryTone } from '../game/npcMemory';
import { summarize } from './summarizeChoice';

/**
 * 주어진 NPC 기억 배열에서 가장 강도가 높은 톤을 반환합니다.
 * 동일한 강도일 경우, 배열에서 먼저 나타나는 톤을 우선합니다.
 * @param memories NPCMemory 배열
 * @returns 가장 강도가 높은 MemoryTone 또는 기본값 'distance'
 */
export interface DominantToneResult {
  tone: MemoryTone;
  strength: number;
}

/**
 * 주어진 NPC 기억 배열에서 가장 강도가 높은 톤과 그 강도를 반환합니다.
 * @param memories NPCMemory 배열
 * @returns 가장 강도가 높은 DominantToneResult 또는 기본값 { tone: 'distance', strength: 0 }
 */
export function getDominantTone(memories: NPCMemory[]): DominantToneResult {
  if (memories.length === 0) {
    return { tone: 'distance', strength: 0 }; // 기본 톤과 강도
  }

  let dominantTone: MemoryTone = 'distance';
  let maxStrength = 0;

  for (const memory of memories) {
    if (memory.strength > maxStrength) {
      maxStrength = memory.strength;
      dominantTone = memory.tone;
    }
  }
  return { tone: dominantTone, strength: maxStrength };
}

/**
 * 유저 입력과 AI 분류 결과를 기반으로 새로운 NPCMemory 객체를 생성합니다.
 * @param npcId NPC ID
 * @param text 유저 입력 텍스트
 * @param tone AI 분류 결과 톤
 * @param turn 현재 턴 수
 * @returns 새로운 NPCMemory 객체
 */
export function toMemory(
  npcId: string,
  text: string,
  tone: MemoryTone,
  turn: number
): NPCMemory {
  return {
    npcId: npcId,
    tone: tone,
    cause: summarize(text), // 요약된 텍스트를 원인으로 사용
    strength: 0.4, // 초기 강도 (조정 가능)
    turn: turn,
  };
}

