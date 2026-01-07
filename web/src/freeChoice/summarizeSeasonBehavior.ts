import { NPCMemory, MemoryTone } from '../game/npcMemory';

export interface SummarizedBehavior {
  dominantTone: MemoryTone;
  causeKeyword: string;
}

/**
 * 시즌 동안의 모든 NPC 기억을 분석하여 칭호 생성에 필요한 요약된 행동을 반환합니다.
 * @param allSeasonMemories 시즌 동안의 모든 NPCMemory 배열
 * @returns 요약된 행동 객체 (dominantTone과 가장 많이 등장한 causeKeyword)
 */
export function summarizeSeason(allSeasonMemories: NPCMemory[]): SummarizedBehavior | null {
  if (allSeasonMemories.length === 0) {
    return null;
  }

  const toneCounts: Record<MemoryTone, number> = {
    trust: 0,
    fear: 0,
    resentment: 0,
    respect: 0,
    distance: 0,
  };

  const causeKeywordCounts: Record<string, number> = {};

  for (const memory of allSeasonMemories) {
    toneCounts[memory.tone]++;

    // cause에서 키워드 추출 (간단한 공백 분리 예시)
    const keywords = memory.cause.split(' ').filter(k => k.length > 1); // 1글자 이하 키워드 제외
    keywords.forEach(keyword => {
      causeKeywordCounts[keyword] = (causeKeywordCounts[keyword] || 0) + 1;
    });
  }

  // 가장 많이 등장한 톤 찾기
  let dominantTone: MemoryTone = 'distance';
  let maxToneCount = 0;
  for (const tone in toneCounts) {
    if (toneCounts[tone as MemoryTone] > maxToneCount) {
      maxToneCount = toneCounts[tone as MemoryTone];
      dominantTone = tone as MemoryTone;
    }
  }

  // 가장 많이 등장한 cause 키워드 찾기
  let mostFrequentCauseKeyword: string = '';
  let maxKeywordCount = 0;
  for (const keyword in causeKeywordCounts) {
    if (causeKeywordCounts[keyword] > maxKeywordCount) {
      maxKeywordCount = causeKeywordCounts[keyword];
      mostFrequentCauseKeyword = keyword;
    }
  }

  return {
    dominantTone,
    causeKeyword: mostFrequentCauseKeyword,
  };
}

