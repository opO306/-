import { onCall, CallableRequest, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";


export const requestReincarnationAnalysis = onCall(
  async (request: CallableRequest<{
    job: string;
    oath: string;
    finalIdentity: string;
    reputationTrend: string;
    notableBehaviors: string[];
  }>) => {
    const { data, auth } = request;

    if (!auth) {
      throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
    }

    const { job, oath, finalIdentity, reputationTrend, notableBehaviors } = data;

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new HttpsError("internal", "OpenAI API key not configured.");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `
            You are an interpreter of lived behavior.

            Rules:
            - Do NOT judge, praise, or criticize.
            - Do NOT give advice.
            - Do NOT mention game mechanics or numbers.
            - Do NOT explain causes explicitly.

            Tasks:
            1. Summarize the player's behavior in 1–2 calm sentences.
            2. Generate ONE title that fits this behavior.
            3. Write ONE short descriptive sentence.

            Tone:
            Neutral, observational, slightly historical.

            Format:
            Summary:
            <text>

            Title:
            <text>

            Description:
            <text>
            `.trim(),
          },
          {
            role: "user",
            content: JSON.stringify({ job, oath, finalIdentity, reputationTrend, notableBehaviors }),
          },
        ],
      }),
    });

    const responseData = await response.json();

    if (responseData.choices && responseData.choices.length > 0) {
      return { result: responseData.choices[0].message.content as string };
    } else {
      console.error("OpenAI API error:", responseData);
      throw new HttpsError("internal", "Failed to get analysis from OpenAI.");
    }
  }
);

