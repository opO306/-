import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function classifyIntent(text: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const prompt = `
다음 문장을 의도 태그 하나로 분류하라.

태그:
- cautious
- responsible
- curious
- detached
- exploitative

문장:
"${text}"

출력은 태그 하나만.
`;

  const res = await model.generateContent(prompt);
  return res.response.text().trim();
}

