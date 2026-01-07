import { ButterflyThreshold } from "./threshold";

export const BUTTERFLY_THRESHOLDS: ButterflyThreshold[] = [
  {
    id: "unstable_world_seed",
    description: "경고 무시 반복 → 불안정한 세계",
    requiredKeys: ["ignored_warning"],
    minTotalWeight: 5,
    outcome: {
      type: "unlock_event_pool",
      value: "unstable_world_events",
    },
  },
  {
    id: "silent_observer_path",
    description: "관찰자 반복 → 기록자 계보",
    requiredKeys: ["persistent_observer"],
    minTotalWeight: 4,
    outcome: {
      type: "unlock_title_track",
      value: "observer_titles",
    },
  },
  {
    id: "extreme_ascetic_bias",
    description: "극단 제약 누적 → 금욕 편향",
    requiredKeys: ["embraced_extreme_constraint"],
    minTotalWeight: 6,
    outcome: {
      type: "modify_outcome_bias",
      value: {
        axis: "asceticHedon",
        bias: -0.3,
      },
    },
  },
];

