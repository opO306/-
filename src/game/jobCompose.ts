export interface ComposedJob {
  baseJobId: string;
  displayName: string; // UI에 표시
}

const TITLE_KEYWORDS = {
  corruption: ["타락", "악명", "두려움", "속삭여"],
  honor: ["명예", "기사도", "맹세", "책임"],
  greed: ["이익", "금전", "계산", "거래"],
  ascetic: ["금욕", "절제", "침묵", "거리"],
  cynic: ["냉소", "체념", "무관심"]
};

function detectTheme(title: string): keyof typeof TITLE_KEYWORDS | null {
  for (const [theme, words] of Object.entries(TITLE_KEYWORDS)) {
    if (words.some(w => title.includes(w))) {
      return theme as any;
    }
  }
  return null;
}

export function composeJob(
  baseJobName: string,
  title: string
): ComposedJob {
  const theme = detectTheme(title);

  // 기사 계열
  if (baseJobName === "Knight") { // '기사' 대신 'Knight'로 변경
    if (theme === "corruption")
      return { baseJobId: "knight", displayName: "타락한 기사" };
    if (theme === "honor")
      return { baseJobId: "knight", displayName: "기사단의 기사" };
  }

  // 시민 계열
  if (baseJobName === "Citizen") { // '시민' 대신 'Citizen'으로 변경
    if (theme === "greed")
      return { baseJobId: "merchant", displayName: "상인" };
    if (theme === "ascetic")
      return { baseJobId: "ascetic", displayName: "수행자" };
  }

  // 학자 계열
  if (baseJobName === "Scholar") { // '학자' 대신 'Scholar'로 변경
    if (theme === "cynic")
      return { baseJobId: "scholar", displayName: "현실주의 학자" };
    if (theme === "corruption")
      return { baseJobId: "scholar", displayName: "금기 연구자" };
  }

  // 기본 fallback
  return {
    baseJobId: baseJobName.toLowerCase(), // 소문자로 변환하여 일관성 유지
    displayName: title.includes(baseJobName) ? title : `${title} ${baseJobName}` // 칭호에 기본 직업이 포함되어 있지 않으면 추가
  };
}

