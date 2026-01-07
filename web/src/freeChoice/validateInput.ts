const BANNED = ["죽인다", "폭행", "성", "강간", "자살", "욕", "씨발", "지랄"];

export function isValidInput(text: string): boolean {
  return !BANNED.some(bad => text.includes(bad));
}

