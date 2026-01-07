// functions/ai/geminiIntentClassifier.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IntentClassifier } from "./types";
import { IntentType } from "../../src/types/situation"; // IntentType 임포트
import { ButterflyAxis, ButterflyMark } from "../../src/types/butterfly"; // ButterflyAxis 임포트

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

// INPUT_RULE, sanitizeInput, isBlocked, isMeaningless는 aiGuard.ts에서 사용되므로 여기서 익스포트
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

// IntentType에 따른 ButterflyMark 생성 규칙 (익스포트)
export const INTENT_MARK_RULES: Record<IntentType, Partial<Record<ButterflyAxis, number>>> = {
  cautious: { orderChaos: -1 },
  responsible: { altruismSelf: +1 },
  curious: { knowledgeDestruction: -1 },
  exploitative: { altruismSelf: -1 },
  detached: { orderChaos: +1 },
  decisive: { asceticHedon: +1 },
  protective: { altruismSelf: +1, orderChaos: -1 },
  experimental: { knowledgeDestruction: +1 },
  defiant: { orderChaos: +1, altruismSelf: -1 },
  conservative: { orderChaos: -1, asceticHedon: -1 },
  bold: { asceticHedon: +1, orderChaos: +1 },
};

export class GeminiIntentClassifier implements IntentClassifier {
  async classify(text: string): Promise<string | null> {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
다음 문장을 의도 태그 하나로 분류하라.

태그:
- cautious
- responsible
- curious
- exploitative
- detached
- defiant
- experimental
- decisive
- protective
- conservative
- bold

문장:
"${text}"

출력은 태그 하나만.
`;

    try {
      const res = await model.generateContent(prompt);
      const output = res.response.text().trim();

      const validIntentTags: IntentType[] = [
        "cautious", "responsible", "curious", "exploitative", "detached",
        "defiant", "experimental", "decisive", "protective", "conservative", "bold"
      ];
      if (validIntentTags.includes(output as IntentType)) {
        return output;
      }
      return null;
    } catch (error) {
      console.error("Error classifying intent with Gemini:", error);
      return null;
    }
  }
}
