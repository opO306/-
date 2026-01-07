import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSituationText(prompt: string): Promise<string | null> {
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.5,
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content: "너는 인크리멘털 게임의 상황 설계자다.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return res.choices[0].message?.content?.trim() ?? null;
  } catch (error) {
    console.error("Error generating situation text with OpenAI:", error);
    return null;
  }
}
