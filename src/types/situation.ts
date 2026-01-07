import { WorldContext } from "@/butterfly/buildWorldContext";

export type SituationGenInput = {
  jobTags: string[]; // 직업 태그 배열로 변경
  archetypeSummary: string;      // "강한 혼돈 성향 · 극단적 금욕 성향"
  constraintMode: "safe" | "risk" | "extreme";
  worldContext: WorldContext;    // 🦋 요약 결과
  chainHint?: {
    tone: string;
    riskLevel: "low" | "medium" | "high";
  };
  recentSituationHashes: string[]; // 반복 방지
};

export type PlayerIntentLog = {
  situationId: string;
  choiceId: string;
  text: string;
  createdAt: number;
};

export type IntentType =
  | "cautious" // 조심
  | "responsible" // 책임
  | "curious" // 호기심
  | "exploitative" // 이용
  | "detached" // 거리두기
  | "decisive" // 결단력 있는
  | "protective" // 보호적인
  | "experimental" // 실험적인
  | "defiant" // 반항적인
  | "conservative" // 보수적인
  | "bold"; // 대담한

