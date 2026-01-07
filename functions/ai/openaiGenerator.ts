// functions/ai/openaiGenerator.ts
import OpenAI from "openai";
import { TextGenerator, AIResult } from "./types";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAISituationGenerator implements TextGenerator {
  async generate(prompt: string): Promise<AIResult> {
    const res = await client.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.5,
      max_tokens: 200,
      messages: [
        { role: "system", content: "너는 인크리멘털 게임의 상황 서술자다." },
        { role: "user", content: prompt },
      ],
    });

    return {
      text: res.choices[0].message.content?.trim() ?? "",
      model: "gpt-4o",
    };
  }
}

