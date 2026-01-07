import { NPCMemory } from "./npcMemory";

export function buildSituationPrompt(input: {
  worldTone: string;
  currentRoleLabel: string;
  recentContext: string;
  lastPlayerAction: string;
  npcMemories: NPCMemory[];
}) {
  return {
    worldTone: input.worldTone,
    currentRoleLabel: input.currentRoleLabel,
    recentContext: input.recentContext,
    lastPlayerAction: input.lastPlayerAction,
    npcImpressions: input.npcMemories.map(m => m.text)
  };
}
