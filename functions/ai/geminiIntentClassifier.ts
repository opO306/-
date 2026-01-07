// functions/ai/geminiIntentClassifier.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IntentClassifier } from "./types";
import { IntentType } from "../../src/types/situation"; // IntentType 임포트

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

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
