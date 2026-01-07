export const archetypeAxes = [
  { id: "orderChaos", label: "Order vs Chaos" },
  { id: "altruismSelf", label: "Altruism vs Self-Interest" },
  { id: "asceticHedon", label: "Asceticism vs Hedonism" },
  { id: "knowledgeDestruction", label: "Knowledge vs Destruction" },
] as const;

export type ArchetypeAxisId = typeof archetypeAxes[number]["id"];

export interface ArchetypeVector {
  orderChaos: number;              // -1…+1
  altruismSelf: number;
  asceticHedon: number;
  knowledgeDestruction: number;
}
