import {
  extractTagsFromTitle,
  autoSelectJob,
  generateJobChoices,
  Job
} from "./jobMapping";

export async function requestReincarnationAnalysis(
  input: {
    job: string;
    oath: string;
    finalIdentity: string;
    reputationTrend: string;
    notableBehaviors: string[];
  }
) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
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
          `.trim()
        },
        {
          role: "user",
          content: JSON.stringify(input)
        }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content as string;
}

export function parseReincarnationText(raw: string) {
  const section = (label: string) =>
    raw.split(label)[1]?.split("\n")[0]?.trim() ?? "";

  return {
    summary: section("Summary:"),
    title: section("Title:"),
    description: section("Description:")
  };
}

export function resolveNextJob(title: string) {
  const tags = extractTagsFromTitle(title);

  const autoJob = autoSelectJob(tags);
  if (autoJob) {
    return {
      mode: "AUTO" as const,
      job: autoJob,
    };
  }

  return {
    mode: "CHOICE" as const,
    options: generateJobChoices(tags),
  };
}
