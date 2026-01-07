export interface ChoiceLog {
  type: string;
  timestamp: number;
}

export interface GameState {
  time: number;
  gold: number; // 방치 루프에서 사용할 자원
  strength: number; // 새로 추가된 strength 속성
  baseJob: "Knight" | "Citizen" | "Scholar";
  oath?: "Chivalry" | null;

  reputation: number; // -100 ~ +100

  identityState:
    | "Honorable"
    | "Questioned"
    | "Dishonored"
    | "Infamous"
    | "Unrecognized";

  logs: {
    choices: ChoiceLog[];
  };
}

export interface RebirthRecord {
  createdAt: number;        // timestamp (client or server)
  baseJob: string;          // 예: "Knight"
  oath: string | null;      // 예: "Chivalry"

  choices: {
    time: number;
    choice: string; // ChoiceLog의 type 필드와 일치
  }[];

  finalReputation: number;
  finalIdentityState: string;

  title: string;            // AI가 만든 칭호
  summary: string;          // AI가 만든 요약
}