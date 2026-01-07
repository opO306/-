export type IdentityState =
  | "Honorable"
  | "Questioned"
  | "Dishonored"
  | "Infamous"
  | "Unrecognized";

export interface GameState {
  time: number;
  job: "Knight";
  oath: "Chivalry";
  reputation: number;
  identity: IdentityState;
  logs: string[];
}

