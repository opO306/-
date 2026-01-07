import { GameState, IdentityState } from './state';

export function updateIdentity(rep: number): IdentityState {
  if (rep >= 40) return "Honorable";
  if (rep >= 10) return "Questioned";
  if (rep >= 0) return "Dishonored";
  if (rep >= -40) return "Infamous";
  return "Unrecognized";
}

export function applyChoice(
  state: GameState,
  choice: "HELP" | "GAIN" | "BETRAY"
): GameState {
  let repDelta = 0;

  if (choice === "HELP") repDelta = +5;
  if (choice === "BETRAY") repDelta = -15;

  const reputation = state.reputation + repDelta;

  return {
    ...state,
    reputation,
    identity: updateIdentity(reputation),
    logs: [...state.logs, choice]
  };
}

