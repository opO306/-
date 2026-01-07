export type ButterflyOutcome =
  | {
      type: "unlock_event_pool";
      value: string;
    }
  | {
      type: "modify_outcome_bias";
      value: {
        axis: "orderChaos" | "altruismSelf" | "asceticHedon" | "knowledgeDestruction";
        bias: number; // -1 ~ +1
      };
    }
  | {
      type: "unlock_title_track";
      value: string;
    }
  | {
      type: "world_state_flag";
      value: string;
    };

export type ButterflyThreshold = {
  id: string;
  description: string; // 내부 설명용 (UI ❌)
  requiredKeys: string[];
  minTotalWeight: number;
  cooldown?: number; // ms, optional
  outcome: ButterflyOutcome;
};

