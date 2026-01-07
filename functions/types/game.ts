import Decimal from "break_infinity.js";

export interface Title {
  id: string;             // 고유 ID (parent-child는 '-'로 연결)
  tags: string[];         // tag를 tags (string 배열)로 변경
  parentId?: string;      // 트리 부모
  label: string;       // UI 표시 이름
  description: string;   // 칭호 설명 추가
  tier: number;        // 0 ~ 5
  unlocked: boolean;   // 초기 잠금 여부 (Citizen만 true)
  path: string;      // "rogue"
  baseXPToNextLevel: Decimal; // 다음 레벨까지 필요한 기본 XP
  famePerSecBonus: Decimal; // 레벨업 시 얻는 Fame/s 보너스
  level: number;       // 현재 칭호 레벨
  xp: Decimal;         // 현재 칭호 XP
  createdAt?: admin.firestore.Timestamp;
}

export type PlayerTitle = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  state: TitleState;
  consumedInto?: string;
};

export type TitleState = "active" | "consumed";

export type CompositeJob = {
  id: string;
  name: string;
  baseJobId: string;
  activeTitleId: string;
  toneTags: string[]; // AI 상황 생성에 사용될 톤 태그
  createdAt?: admin.firestore.Timestamp;
};
