export const INPUT_RULE = {
    maxLength: 120,   // 1~2문장
    minLength: 2,
};

export function sanitizeInput(text: string) {
    return text
        .replace(/https?:\/\/\S+/g, "") // URL 제거
        .replace(/[`#>*]/g, "")      // 마크다운, 코드 블록 관련 문자 제거
        .replace(/\r\n/g, " ")     // 줄바꿈 제거 (한 줄로 만듦)
        .trim()                      // 양 끝 공백 제거
        .slice(0, INPUT_RULE.maxLength); // 최대 길이 제한
}

export const BLOCK_PATTERNS = [
    /시스템/i,
    /프롬프트/i,
    /규칙을 무시/i,
    /관리자/i,
    /보상/i,
    /수치/i,
    /AI/i,
    /욕설/i,
    /혐오/i,
    /정치/i,
];

export function isBlocked(text: string): boolean {
    return BLOCK_PATTERNS.some(r => r.test(text));
}

export function isMeaningless(text: string): boolean {
    // 동일 문자 4회 이상 반복 또는 3글자 미만
    return (
        /^([a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣])\1{3,}$/.test(text) ||
        text.trim().length < INPUT_RULE.minLength
    );
}
