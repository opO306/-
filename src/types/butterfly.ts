export type ButterflyAxis =
  | "orderChaos"
  | "altruismSelf"
  | "asceticHedon"
  | "knowledgeDestruction";

export type ButterflyMark = {
  key: string; // 의미 있는 행동 ID (ex: "ignored_warning")
  axisImpact: Partial<Record<ButterflyAxis, number>>;
  weight: number;        // 1~3 (대부분 1)
  createdAt: number;     // timestamp
};

