// src/utils/jobComposite.ts

import { ArchetypeVector } from "../types/archetype"; // ArchetypeVector 타입 임포트

export type BaseJob = "Citizen" | "Warrior" | "Scholar";

export type CoreTag =
  | "destruction"
  | "creation"
  | "selfish"
  | "altruistic";

// 성향 벡터를 기반으로 CoreTag를 추출하는 함수 (MVP용)
function getCoreTagsFromArchetype(archetype: ArchetypeVector): Record<CoreTag, number> {
  const tags: Record<CoreTag, number> = {
    destruction: 0,
    creation: 0,
    selfish: 0,
    altruistic: 0,
  };

  // MVP 성향 벡터 매핑 (예시, 실제 값은 조정 필요)
  if (archetype.knowledgeDestruction < 0) tags.destruction = Math.abs(archetype.knowledgeDestruction);
  if (archetype.knowledgeDestruction > 0) tags.creation = Math.abs(archetype.knowledgeDestruction);
  if (archetype.altruismSelf < 0) tags.selfish = Math.abs(archetype.altruismSelf);
  if (archetype.altruismSelf > 0) tags.altruistic = Math.abs(archetype.altruismSelf);

  return tags;
}

// 칭호 + 직업 합성 테이블 (MVP 전용)
export function getCompositeJob(baseJob: BaseJob, archetype: ArchetypeVector): string {
  const tags = getCoreTagsFromArchetype(archetype);

  if (baseJob === "Citizen") {
    if (tags.destruction >= 2 && tags.selfish >= 1) return "Lumberjack";
    if (tags.creation >= 2 && tags.altruistic >= 1) return "Builder";
  }

  if (baseJob === "Warrior") {
    if (tags.destruction >= 2) return "Ravager";
    if (tags.altruistic >= 2) return "Guardian";
  }

  if (baseJob === "Scholar") {
    if (tags.selfish >= 2) return "Exploiter";
    if (tags.creation >= 2) return "Preserver";
  }

  return baseJob; // 합성 실패 시 기본 직업 반환
}

