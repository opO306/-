import {
  ORDER_CHAOS,
  ALTRUISM_SELF,
  ASCETIC_HEDON,
  KNOWLEDGE_DESTRUCTION,
} from "./archetypeDescriptors";
import { ArchetypeVector } from "@/types/archetype";
import { getAxisText } from "./getAxisText";

export function generateArchetypeSummary(
  archetype: ArchetypeVector
): string {
  const axes = [
    {
      key: "orderChaos",
      value: archetype.orderChaos,
      descriptors: ORDER_CHAOS,
    },
    {
      key: "altruismSelf",
      value: archetype.altruismSelf,
      descriptors: ALTRUISM_SELF,
    },
    {
      key: "asceticHedon",
      value: archetype.asceticHedon,
      descriptors: ASCETIC_HEDON,
    },
    {
      key: "knowledgeDestruction",
      value: archetype.knowledgeDestruction,
      descriptors: KNOWLEDGE_DESTRUCTION,
    },
  ];

  // 절대값 기준으로 영향력 정렬
  const dominant = axes
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 2)
    .filter((a) => Math.abs(a.value) > 20); // 의미 없는 축 제거

  if (dominant.length === 0) {
    return "뚜렷한 성향 없이 균형을 유지하고 있음";
  }

  const texts = dominant.map((a) =>
    getAxisText(a.value, a.descriptors)
  );

  return texts.join(" · ");
}
