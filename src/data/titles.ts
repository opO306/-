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
  { id: "citizen", tag: "common", path: "citizen", label: "시민", tier: 0, unlocked: true, baseXPToNextLevel: new Decimal(10), famePerSecBonus: new Decimal(1), level: 0, xp: new Decimal(0) },

  // ─── Warrior Path ───
  { id: "citizen-warrior", parentId: "citizen", tag: "battle", path: "warrior", label: "훈련병", tier: 1, unlocked: false, baseXPToNextLevel: new Decimal(100), famePerSecBonus: new Decimal(5), level: -1, xp: new Decimal(0) },
  { id: "citizen-warrior-soldier", parentId: "citizen-warrior", tag: "battle", path: "warrior", label: "병사", tier: 2, unlocked: false, baseXPToNextLevel: new Decimal(500), famePerSecBonus: new Decimal(20), level: -1, xp: new Decimal(0) },
  { id: "citizen-warrior-knight", parentId: "citizen-warrior-soldier", tag: "battle", path: "warrior", label: "기사", tier: 3, unlocked: false, baseXPToNextLevel: new Decimal(2000), famePerSecBonus: new Decimal(100), level: -1, xp: new Decimal(0) },
  { id: "citizen-warrior-hero", parentId: "citizen-warrior-knight", tag: "battle", path: "warrior", label: "영웅", tier: 4, unlocked: false, baseXPToNextLevel: new Decimal(10000), famePerSecBonus: new Decimal(500), level: -1, xp: new Decimal(0) },
  { id: "citizen-warrior-paladin", parentId: "citizen-warrior-hero", tag: "battle", path: "warrior", label: "성기사", tier: 5, unlocked: false, baseXPToNextLevel: new Decimal(50000), famePerSecBonus: new Decimal(2500), level: -1, xp: new Decimal(0) },

  // ─── Rogue Path ───
  { id: "citizen-rogue-pickpocket", parentId: "citizen", tag: "stealth", path: "rogue", label: "소매치기", tier: 1, unlocked: false, baseXPToNextLevel: new Decimal(100), famePerSecBonus: new Decimal(5), level: -1, xp: new Decimal(0) },
  { id: "citizen-rogue-thug", parentId: "citizen-rogue-pickpocket", tag: "stealth", path: "rogue", label: "폭력배", tier: 2, unlocked: false, baseXPToNextLevel: new Decimal(500), famePerSecBonus: new Decimal(20), level: -1, xp: new Decimal(0) },
  { id: "citizen-rogue-bandit", parentId: "citizen-rogue-thug", tag: "stealth", path: "rogue", label: "산적", tier: 3, unlocked: false, baseXPToNextLevel: new Decimal(2000), famePerSecBonus: new Decimal(100), level: -1, xp: new Decimal(0) },
  { id: "citizen-rogue-masterthief", parentId: "citizen-rogue-bandit", tag: "stealth", path: "rogue", label: "도적왕", tier: 4, unlocked: false, baseXPToNextLevel: new Decimal(10000), famePerSecBonus: new Decimal(500), level: -1, xp: new Decimal(0) },
  { id: "citizen-rogue-shadowlord", parentId: "citizen-rogue-masterthief", tag: "stealth", path: "rogue", label: "어둠의 군주", tier: 5, unlocked: false, baseXPToNextLevel: new Decimal(50000), famePerSecBonus: new Decimal(2500), level: -1, xp: new Decimal(0) },

  // ─── Mage Path ───
  { id: "citizen-mage-apprentice", parentId: "citizen", tag: "magic", path: "mage", label: "견습생", tier: 1, unlocked: false, baseXPToNextLevel: new Decimal(100), famePerSecBonus: new Decimal(5), level: -1, xp: new Decimal(0) },
  { id: "citizen-mage-adept", parentId: "citizen-mage-apprentice", tag: "magic", path: "mage", label: "숙련자", tier: 2, unlocked: false, baseXPToNextLevel: new Decimal(500), famePerSecBonus: new Decimal(20), level: -1, xp: new Decimal(0) },
  { id: "citizen-mage-sorcerer", parentId: "citizen-mage-adept", tag: "magic", path: "mage", label: "마법사", tier: 3, unlocked: false, baseXPToNextLevel: new Decimal(2000), famePerSecBonus: new Decimal(100), level: -1, xp: new Decimal(0) },
  { id: "citizen-mage-archmage", parentId: "citizen-mage-sorcerer", tag: "magic", path: "mage", label: "대마법사", tier: 4, unlocked: false, baseXPToNextLevel: new Decimal(10000), famePerSecBonus: new Decimal(500), level: -1, xp: new Decimal(0) },
  { id: "citizen-mage-chronomancer", parentId: "citizen-mage-archmage", tag: "magic", path: "mage", label: "시간의 지배자", tier: 5, unlocked: false, baseXPToNextLevel: new Decimal(50000), famePerSecBonus: new Decimal(2500), level: -1, xp: new Decimal(0) },

  // ─── Merchant Path ───
  { id: "citizen-merchant-peddler", parentId: "citizen", tag: "trade", path: "merchant", label: "행상인", tier: 1, unlocked: false, baseXPToNextLevel: new Decimal(100), famePerSecBonus: new Decimal(5), level: -1, xp: new Decimal(0) },
  { id: "citizen-merchant-trader", parentId: "citizen-merchant-peddler", tag: "trade", path: "merchant", label: "상인", tier: 2, unlocked: false, baseXPToNextLevel: new Decimal(500), famePerSecBonus: new Decimal(20), level: -1, xp: new Decimal(0) },
  { id: "citizen-merchant-smuggler", parentId: "citizen-merchant-trader", tag: "trade", path: "merchant", label: "밀수꾼", tier: 3, unlocked: false, baseXPToNextLevel: new Decimal(2000), famePerSecBonus: new Decimal(100), level: -1, xp: new Decimal(0) },
  { id: "citizen-merchant-blackmarket", parentId: "citizen-merchant-smuggler", tag: "trade", path: "merchant", label: "암거래상", tier: 4, unlocked: false, baseXPToNextLevel: new Decimal(10000), famePerSecBonus: new Decimal(500), level: -1, xp: new Decimal(0) },
  { id: "citizen-merchant-guildtycoon", parentId: "citizen-merchant-blackmarket", tag: "trade", path: "merchant", label: "길드 거물", tier: 5, unlocked: false, baseXPToNextLevel: new Decimal(50000), famePerSecBonus: new Decimal(2500), level: -1, xp: new Decimal(0) },

  // ─── Detective Path ───
  { id: "citizen-detective-rookie", parentId: "citizen", tag: "investigation", path: "detective", label: "초보 탐정", tier: 1, unlocked: false, baseXPToNextLevel: new Decimal(100), famePerSecBonus: new Decimal(5), level: -1, xp: new Decimal(0) },
  { id: "citizen-detective-privateeye", parentId: "citizen-detective-rookie", tag: "investigation", path: "detective", label: "사립 탐정", tier: 2, unlocked: false, baseXPToNextLevel: new Decimal(500), famePerSecBonus: new Decimal(20), level: -1, xp: new Decimal(0) },
  { id: "citizen-detective-inspector", parentId: "citizen-detective-privateeye", tag: "investigation", path: "detective", label: "경위", tier: 3, unlocked: false, baseXPToNextLevel: new Decimal(2000), famePerSecBonus: new Decimal(100), level: -1, xp: new Decimal(0) },
  { id: "citizen-detective-acedetective", parentId: "citizen-detective-inspector", tag: "investigation", path: "detective", label: "명탐정", tier: 4, unlocked: false, baseXPToNextLevel: new Decimal(10000), famePerSecBonus: new Decimal(500), level: -1, xp: new Decimal(0) },
  { id: "citizen-detective-shadowobserver", parentId: "citizen-detective-acedetective", tag: "investigation", path: "detective", label: "어둠의 감시자", tier: 5, unlocked: false, baseXPToNextLevel: new Decimal(50000), famePerSecBonus: new Decimal(2500), level: -1, xp: new Decimal(0) },

  // ─── Gunslinger Path ───
  { id: "citizen-gunslinger-marksman", parentId: "citizen", tag: "ranged", path: "gunslinger", label: "명사수", tier: 1, unlocked: false, baseXPToNextLevel: new Decimal(100), famePerSecBonus: new Decimal(5), level: -1, xp: new Decimal(0) },
  { id: "citizen-gunslinger-gunslinger", parentId: "citizen-gunslinger-marksman", tag: "ranged", path: "gunslinger", label: "총잡이", tier: 2, unlocked: false, baseXPToNextLevel: new Decimal(500), famePerSecBonus: new Decimal(20), level: -1, xp: new Decimal(0) },
  { id: "citizen-gunslinger-sharpshooter", parentId: "citizen-gunslinger-gunslinger", tag: "ranged", path: "gunslinger", label: "저격수", tier: 3, unlocked: false, baseXPToNextLevel: new Decimal(2000), famePerSecBonus: new Decimal(100), level: -1, xp: new Decimal(0) },
  { id: "citizen-gunslinger-outlaw", parentId: "citizen-gunslinger-sharpshooter", tag: "ranged", path: "gunslinger", label: "무법자", tier: 4, unlocked: false, baseXPToNextLevel: new Decimal(10000), famePerSecBonus: new Decimal(500), level: -1, xp: new Decimal(0) },
  { id: "citizen-gunslinger-legendarygun", parentId: "citizen-gunslinger-outlaw", tag: "ranged", path: "gunslinger", label: "전설의 총잡이", tier: 5, unlocked: false, baseXPToNextLevel: new Decimal(50000), famePerSecBonus: new Decimal(2500), level: -1, xp: new Decimal(0) },
];

// Helper: 경로별 노드 필터
export function getNodesByJob(job: string): Title[] {
  if (job === "citizen") return TITLE_NODES.filter((n) => n.id === "citizen");
  return TITLE_NODES.filter((n) => n.id.startsWith(`citizen-${job}`) || n.id === "citizen");
}
