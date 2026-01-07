import { ButterflyMark } from "@/types/butterfly";

export type MarkTriggerContext = {
  event: string;               // "situation_choice"
  choiceId?: string;           // "observe_only"
  constraintMode?: "safe" | "risk" | "extreme";
  ignoredWarning?: boolean;
};

export const BUTTERFLY_MARK_RULES: {
  when: (ctx: MarkTriggerContext) => boolean;
  create: () => ButterflyMark;
}[] = [
  {
    // 경고 무시
    when: (ctx) => ctx.ignoredWarning === true,
    create: () => ({
      key: "ignored_warning",
      axisImpact: { orderChaos: +2 },
      weight: 1,
      createdAt: Date.now(),
    }),
  },
  {
    // 관찰만 선택
    when: (ctx) => ctx.choiceId === "observe_only",
    create: () => ({
      key: "persistent_observer",
      axisImpact: { knowledgeDestruction: -1 },
      weight: 1,
      createdAt: Date.now(),
    }),
  },
  {
    // 극단 제약 수락
    when: (ctx) => ctx.constraintMode === "extreme",
    create: () => ({
      key: "embraced_extreme_constraint",
      axisImpact: { asceticHedon: -2 },
      weight: 2,
      createdAt: Date.now(),
    }),
  },
];

