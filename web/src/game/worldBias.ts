import { NPCMemory } from "./npcMemory";

export interface WorldBias {
  conflictChance: number;
  cooperationChance: number;
  avoidanceChance: number;
}

const BASE_BIAS: WorldBias = {
  conflictChance: 0.2,
  cooperationChance: 0.4,
  avoidanceChance: 0.1
};

export function calculateWorldBias(memories: NPCMemory[]): WorldBias {
  let bias = { ...BASE_BIAS };

  for (const mem of memories) {
    const w = mem.strength;

    switch (mem.tone) {
      case "fear":
        bias.conflictChance += 0.1 * w;
        bias.cooperationChance -= 0.05 * w;
        bias.avoidanceChance += 0.1 * w;
        break;

      case "trust":
        bias.cooperationChance += 0.15 * w;
        bias.conflictChance -= 0.05 * w;
        break;

      case "resentment":
        bias.conflictChance += 0.1 * w;
        bias.cooperationChance -= 0.1 * w;
        break;

      case "distance":
        bias.avoidanceChance += 0.15 * w;
        break;

      case "respect":
        bias.cooperationChance += 0.1 * w;
        break;
    }
  }

  return clampBias(bias);
}

function clampBias(bias: WorldBias): WorldBias {
  return {
    conflictChance: clamp(bias.conflictChance),
    cooperationChance: clamp(bias.cooperationChance),
    avoidanceChance: clamp(bias.avoidanceChance)
  };
}

function clamp(n: number) {
  return Math.max(0, Math.min(0.9, n));
}
