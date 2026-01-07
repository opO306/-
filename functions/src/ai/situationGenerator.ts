import OpenAI from "openai";
import { recordAIFailure, recordAISuccess } from "../ops/aiHealth";
import { getDuplicationRate } from "../ops/contentMetrics";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSituationWithAI(prompt: string, initialTemperature: number = 0.5) {
  let temperature = initialTemperature;
  if (process.env.AI_ENABLED === "true") { // Only adjust temperature if AI is enabled for content generation
    const duplicationRate = await getDuplicationRate();
    if (duplicationRate > 0.2) {
      temperature = Math.min(initialTemperature + 0.05, 0.7);
    }
  }

  try {
    const res = await client.chat.completions.create({
      model: "gpt-4o",
      temperature: temperature,
      max_tokens: 180,
      messages: [
        {
          role: "system",
          content:
            "너는 인크리멘털 게임의 상황 서술자다. 설명, 교훈, 결론을 쓰지 마라.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    await recordAISuccess();
    return res.choices[0].message.content?.trim();
  } catch (error) {
    await recordAIFailure();
    console.error("AI generation failed:", error);
    throw error; // Propagate the error so fallback can be used
  }
}

