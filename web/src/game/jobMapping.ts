export type TitleTag =
  | "HONOR"
  | "GREED"
  | "DISCIPLINE"
  | "CRUELTY";

export function extractTagsFromTitle(title: string): TitleTag[] {
  const tags: TitleTag[] = [];

  if (/기사|명예|기사도/.test(title)) tags.push("HONOR");
  if (/탐욕|이익|금전|상인/.test(title)) tags.push("GREED");
  if (/금욕|절제|규율/.test(title)) tags.push("DISCIPLINE");
  if (/타락|잔혹|공포/.test(title)) tags.push("CRUELTY");

  return tags;
}

export type Job =
  | "Knight"
  | "FallenKnight"
  | "DreadKnight"
  | "Merchant"
  | "Ascetic"
  | "Wanderer";

export function autoSelectJob(tags: TitleTag[]): Job | null {
  if (tags.includes("CRUELTY") && tags.includes("HONOR")) {
    return "DreadKnight"; // 악명 높은 기사
  }

  if (tags.includes("CRUELTY")) {
    return "FallenKnight"; // 타락한 기사
  }

  if (tags.includes("GREED")) {
    return "Merchant"; // 돈에 미친 상인
  }

  if (tags.includes("DISCIPLINE")) {
    return "Ascetic"; // 금욕가
  }

  if (tags.includes("HONOR")) {
    return "Knight";
  }

  return null; // 애매함 → 선택 단계로
}

export function generateJobChoices(tags: TitleTag[]): Job[] {
  const pool: Job[] = [];

  if (tags.includes("HONOR")) pool.push("Knight");
  if (tags.includes("CRUELTY")) pool.push("FallenKnight");
  if (tags.includes("GREED")) pool.push("Merchant");
  if (tags.includes("DISCIPLINE")) pool.push("Ascetic");

  if (pool.length === 0) {
    pool.push("Wanderer"); // 안전망
  }

  return pool.slice(0, 2); // 최대 2개
}

