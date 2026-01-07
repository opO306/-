export interface SessionMetrics {
  stayResearchSec: number;     // seconds spent in Research tab
  stayExpeditionSec: number;   // seconds in Expedition tab
  clicks: number;              // manual taps / clicks
  highRiskExpeditions: number; // ★4–5 expedition attempts
  researchCost: string;        // Decimal as string (Σ Fame spent)
  upgradeCost: string;         // Decimal as string (Σ Fame spent on upgrades)
  challengesCleared: number;   // count in this session
  prestigeGapMin: number;      // minutes since last Prestige
}

export const EmptySessionMetrics: SessionMetrics = {
  stayResearchSec: 0,
  stayExpeditionSec: 0,
  clicks: 0,
  highRiskExpeditions: 0,
  researchCost: "0",
  upgradeCost: "0",
  challengesCleared: 0,
  prestigeGapMin: 0,
};
