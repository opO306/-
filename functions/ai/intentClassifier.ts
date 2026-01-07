import OpenAI from "openai";
import { IntentType } from "../../src/types/situation"; // IntentType 임포트

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// LLM 의도 분류 전용 프롬프트 (격리)
function buildIntentClassificationPrompt(text: string): string {
  const intentTypes: IntentType[] = [
    "cautious", "responsible", "curious", "exploitative",
    "detached", "decisive", "protective", "experimental", "defiant",
    "conservative", "bold"
  ];
  const intentList = intentTypes.map(t => `- ${t}`).join("\\n");

  return `
역할: 너는 텍스트 분류기다.
다음 문장에서 "의도 태그" 하나만 선택하라.

선택지:
${intentList}

규칙:
- 분석 설명 금지
- 다른 출력 금지
- 반드시 하나만 출력

문장:
"${text}"
`;
}

export async function classifyIntent(text: string): Promise<string | null> {
  // TODO: isBlocked 함수는 analyzeIntent.ts (원래 위치)에서 계속 사용해야 함.
  // 여기서는 LLM 호출 전의 필터링은 외부에서 이루어진다고 가정.

  try {
    const prompt = buildIntentClassificationPrompt(text);
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      max_tokens: 10,
      messages: [
        {
          role: "system",
          content: "너는 텍스트 분류기다.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const aiResponse = res.choices[0].message?.content?.trim() || "";
    const classifiedTag = aiResponse.startsWith("- ") ? aiResponse.substring(2) : aiResponse;

    // 정의된 IntentType에 해당하는지 확인
    const validIntentTypes: IntentType[] = [
      "cautious", "responsible", "curious", "exploitative", "detached",
      "decisive", "protective", "experimental", "defiant", "conservative", "bold"
    ];

    if (validIntentTypes.includes(classifiedTag as IntentType)) {
      return classifiedTag;
    }

    return null; // 분류된 의도 없음
  } catch (error) {
    console.error("Error classifying intent with OpenAI:", error);
    return null;
  }
}
