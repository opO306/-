import { ArchetypeVector } from "@/types/archetype";
import { calcArchetypeDelta } from "./calcArchetypeDelta";
import { classifyDelta } from "./deltaThresholds";

const AXIS_LABEL: Record<string, [string, string]> = {
  orderChaos: ["질서", "혼돈"],
  altruismSelf: ["이타", "사리"],
  asceticHedon: ["금욕", "쾌락"],
  knowledgeDestruction: ["이해", "파괴"],
};

export function generateRebirthDiff(
  before: ArchetypeVector,
  after: ArchetypeVector
): string[] {
  const deltas = calcArchetypeDelta(before, after);

  const sentences: string[] = [];

  deltas.forEach(({ axis, delta }) => {
    const level = classifyDelta(delta);
    if (level === "none") return;

    const [neg, pos] = AXIS_LABEL[axis];
    const direction = delta > 0 ? pos : neg;

    if (level === "minor") {
      sentences.push(`${direction} 쪽으로 조금 기울었다`);
    } else {
      sentences.push(`${direction} 성향이 뚜렷해졌다`);
    }
  });

  if (sentences.length === 0) {
    return ["이번 환생은 당신을 거의 바꾸지 않았다"];
  }

  return sentences;
}
