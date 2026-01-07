export interface ChoiceLog {
  type: string;
  timestamp: number;
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

export type CompositeJob = {
  id: string;
  name: string;
  toneTags: string[];
  baseJobId: string;
  activeTitleId: string;
  createdAt: number; // Timestamp 대신 number 사용
};