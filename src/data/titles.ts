import Decimal from "break_infinity.js";
import { Title } from "../types/title"; // src/types/title에서 Title 타입 임포트

/*
 * 칭호 트리 데이터 – Title 배열
 * 직업(Job) × 티어(Tier) 0~5 노드를 일괄 정의한다.
 * UI 컴포넌트 TitleTree.tsx 에서 그대로 사용 가능.
 */

// Tier 순서 유지; id는 하이픈으로 parent 연결 (citizen-warrior-recruit …)
export const TITLE_NODES: Title[] = [
  // ─── 공통 루트 ───
  { id: "citizen", tags: ["common"], label: "시민", description: "설명 없음", path: "citizen", tier: 0, unlocked: true, baseXPToNextLevel: new Decimal(10), famePerSecBonus: new Decimal(1), level: 0, xp: new Decimal(0) },

  // ─── Warrior Path ───
  { id: "citizen-warrior", parentId: "citizen", tags: ["battle"], label: "훈련병", description: "설명 없음", path: "warrior", tier: 1, unlocked: false, baseXPToNextLevel: new Decimal(100), famePerSecBonus: new Decimal(5), level: -1, xp: new Decimal(0) },
  { id: "citizen-warrior-soldier", parentId: "citizen-warrior", tags: ["battle"], label: "병사", description: "설명 없음", path: "warrior", tier: 2, unlocked: false, baseXPToNextLevel: new Decimal(500), famePerSecBonus: new Decimal(20), level: -1, xp: new Decimal(0) },
  { id: "citizen-warrior-knight", parentId: "citizen-warrior-soldier", tags: ["battle"], label: "기사", description: "설명 없음", path: "warrior", tier: 3, unlocked: false, baseXPToNextLevel: new Decimal(2000), famePerSecBonus: new Decimal(100), level: -1, xp: new Decimal(0) },
  { id: "citizen-warrior-hero", parentId: "citizen-warrior-knight", tags: ["battle"], label: "영웅", description: "설명 없음", path: "warrior", tier: 4, unlocked: false, baseXPToNextLevel: new Decimal(10000), famePerSecBonus: new Decimal(500), level: -1, xp: new Decimal(0) },
  { id: "citizen-warrior-paladin", parentId: "citizen-warrior-hero", tags: ["battle"], label: "성기사", description: "설명 없음", path: "warrior", tier: 5, unlocked: false, baseXPToNextLevel: new Decimal(50000), famePerSecBonus: new Decimal(2500), level: -1, xp: new Decimal(0) },

  // ─── Rogue Path ───
  { id: "citizen-rogue-pickpocket", parentId: "citizen", tags: ["stealth"], label: "소매치기", description: "설명 없음", path: "rogue", tier: 1, unlocked: false, baseXPToNextLevel: new Decimal(100), famePerSecBonus: new Decimal(5), level: -1, xp: new Decimal(0) },
  { id: "citizen-rogue-thug", parentId: "citizen-rogue-pickpocket", tags: ["stealth"], label: "폭력배", description: "설명 없음", path: "rogue", tier: 2, unlocked: false, baseXPToNextLevel: new Decimal(500), famePerSecBonus: new Decimal(20), level: -1, xp: new Decimal(0) },
  { id: "citizen-rogue-bandit", parentId: "citizen-rogue-thug", tags: ["stealth"], label: "산적", description: "설명 없음", path: "rogue", tier: 3, unlocked: false, baseXPToNextLevel: new Decimal(2000), famePerSecBonus: new Decimal(100), level: -1, xp: new Decimal(0) },
  { id: "citizen-rogue-masterthief", parentId: "citizen-rogue-bandit", tags: ["stealth"], label: "도적왕", description: "설명 없음", path: "rogue", tier: 4, unlocked: false, baseXPToNextLevel: new Decimal(10000), famePerSecBonus: new Decimal(500), level: -1, xp: new Decimal(0) },
  { id: "citizen-rogue-shadowlord", parentId: "citizen-rogue-masterthief", tags: ["stealth"], label: "어둠의 군주", description: "설명 없음", path: "rogue", tier: 5, unlocked: false, baseXPToNextLevel: new Decimal(50000), famePerSecBonus: new Decimal(2500), level: -1, xp: new Decimal(0) },

  // ─── Mage Path ───
  { id: "citizen-mage-apprentice", parentId: "citizen", tags: ["magic"], label: "견습생", description: "설명 없음", path: "mage", tier: 1, unlocked: false, baseXPToNextLevel: new Decimal(100), famePerSecBonus: new Decimal(5), level: -1, xp: new Decimal(0) },
  { id: "citizen-mage-adept", parentId: "citizen-mage-apprentice", tags: ["magic"], label: "숙련자", description: "설명 없음", path: "mage", tier: 2, unlocked: false, baseXPToNextLevel: new Decimal(500), famePerSecBonus: new Decimal(20), level: -1, xp: new Decimal(0) },
  { id: "citizen-mage-sorcerer", parentId: "citizen-mage-adept", tags: ["magic"], label: "마법사", description: "설명 없음", path: "mage", tier: 3, unlocked: false, baseXPToNextLevel: new Decimal(2000), famePerSecBonus: new Decimal(100), level: -1, xp: new Decimal(0) },
  { id: "citizen-mage-archmage", parentId: "citizen-mage-sorcerer", tags: ["magic"], label: "대마법사", description: "설명 없음", path: "mage", tier: 4, unlocked: false, baseXPToNextLevel: new Decimal(10000), famePerSecBonus: new Decimal(500), level: -1, xp: new Decimal(0) },
  { id: "citizen-mage-chronomancer", parentId: "citizen-mage-archmage", tags: ["magic"], label: "시간의 지배자", description: "설명 없음", path: "mage", tier: 5, unlocked: false, baseXPToNextLevel: new Decimal(50000), famePerSecBonus: new Decimal(2500), level: -1, xp: new Decimal(0) },

  // ─── Merchant Path ───
  { id: "citizen-merchant-peddler", parentId: "citizen", tags: ["trade"], label: "행상인", description: "설명 없음", path: "merchant", tier: 1, unlocked: false, baseXPToNextLevel: new Decimal(100), famePerSecBonus: new Decimal(5), level: -1, xp: new Decimal(0) },
  { id: "citizen-merchant-trader", parentId: "citizen-merchant-peddler", tags: ["trade"], label: "상인", description: "설명 없음", path: "merchant", tier: 2, unlocked: false, baseXPToNextLevel: new Decimal(500), famePerSecBonus: new Decimal(20), level: -1, xp: new Decimal(0) },
  { id: "citizen-merchant-smuggler", parentId: "citizen-merchant-trader", tags: ["trade"], label: "밀수꾼", description: "설명 없음", path: "merchant", tier: 3, unlocked: false, baseXPToNextLevel: new Decimal(2000), famePerSecBonus: new Decimal(100), level: -1, xp: new Decimal(0) },
  { id: "citizen-merchant-blackmarket", parentId: "citizen-merchant-smuggler", tags: ["trade"], label: "암거래상", description: "설명 없음", path: "merchant", tier: 4, unlocked: false, baseXPToNextLevel: new Decimal(10000), famePerSecBonus: new Decimal(500), level: -1, xp: new Decimal(0) },
  { id: "citizen-merchant-guildtycoon", parentId: "citizen-merchant-blackmarket", tags: ["trade"], label: "길드 거물", description: "설명 없음", path: "merchant", tier: 5, unlocked: false, baseXPToNextLevel: new Decimal(50000), famePerSecBonus: new Decimal(2500), level: -1, xp: new Decimal(0) },

  // ─── Detective Path ───
  { id: "citizen-detective-rookie", parentId: "citizen", tags: ["investigation"], label: "초보 탐정", description: "설명 없음", path: "detective", tier: 1, unlocked: false, baseXPToNextLevel: new Decimal(100), famePerSecBonus: new Decimal(5), level: -1, xp: new Decimal(0) },
  { id: "citizen-detective-privateeye", parentId: "citizen-detective-rookie", tags: ["investigation"], label: "사립 탐정", description: "설명 없음", path: "detective", tier: 2, unlocked: false, baseXPToNextLevel: new Decimal(500), famePerSecBonus: new Decimal(20), level: -1, xp: new Decimal(0) },
  { id: "citizen-detective-inspector", parentId: "citizen-detective-privateeye", tags: ["investigation"], label: "경위", description: "설명 없음", path: "detective", tier: 3, unlocked: false, baseXPToNextLevel: new Decimal(2000), famePerSecBonus: new Decimal(100), level: -1, xp: new Decimal(0) },
  { id: "citizen-detective-acedetective", parentId: "citizen-detective-inspector", tags: ["investigation"], label: "명탐정", description: "설명 없음", path: "detective", tier: 4, unlocked: false, baseXPToNextLevel: new Decimal(10000), famePerSecBonus: new Decimal(500), level: -1, xp: new Decimal(0) },
  { id: "citizen-detective-shadowobserver", parentId: "citizen-detective-acedetective", tags: ["investigation"], label: "어둠의 감시자", description: "설명 없음", path: "detective", tier: 5, unlocked: false, baseXPToNextLevel: new Decimal(50000), famePerSecBonus: new Decimal(2500), level: -1, xp: new Decimal(0) },

  // ─── Gunslinger Path ───
  { id: "citizen-gunslinger-marksman", parentId: "citizen", tags: ["ranged"], label: "명사수", description: "설명 없음", path: "gunslinger", tier: 1, unlocked: false, baseXPToNextLevel: new Decimal(100), famePerSecBonus: new Decimal(5), level: -1, xp: new Decimal(0) },
  { id: "citizen-gunslinger-gunslinger", parentId: "citizen-gunslinger-marksman", tags: ["ranged"], label: "총잡이", description: "설명 없음", path: "gunslinger", tier: 2, unlocked: false, baseXPToNextLevel: new Decimal(500), famePerSecBonus: new Decimal(20), level: -1, xp: new Decimal(0) },
  { id: "citizen-gunslinger-sharpshooter", parentId: "citizen-gunslinger-gunslinger", tags: ["ranged"], label: "저격수", description: "설명 없음", path: "gunslinger", tier: 3, unlocked: false, baseXPToNextLevel: new Decimal(2000), famePerSecBonus: new Decimal(100), level: -1, xp: new Decimal(0) },
  { id: "citizen-gunslinger-outlaw", parentId: "citizen-gunslinger-sharpshooter", tags: ["ranged"], label: "무법자", description: "설명 없음", path: "gunslinger", tier: 4, unlocked: false, baseXPToNextLevel: new Decimal(10000), famePerSecBonus: new Decimal(500), level: -1, xp: new Decimal(0) },
  { id: "citizen-gunslinger-legendarygun", parentId: "citizen-gunslinger-outlaw", tags: ["ranged"], label: "전설의 총잡이", description: "설명 없음", path: "gunslinger", tier: 5, unlocked: false, baseXPToNextLevel: new Decimal(50000), famePerSecBonus: new Decimal(2500), level: -1, xp: new Decimal(0) },
];

// Helper: 경로별 노드 필터
export function getNodesByJob(job: string): Title[] {
  if (job === "citizen") return TITLE_NODES.filter((n) => n.id === "citizen");
  return TITLE_NODES.filter((n) => n.id.startsWith(`citizen-${job}`) || n.id === "citizen");
}
