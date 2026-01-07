import { onCall } from "firebase-functions/v2/https";
import { Job } from "../../src/types/job";
import { Title } from "../../src/types/title";
import { generateSituationWithAI } from "../ai/openaiSituationGenerator";
import { buildComposedJobPrompt } from "../ai/buildComposedJobPrompt";

export interface ComposedJob {
  baseJobId: string;
  displayName: string;
  description: string;
}

export const composeJobCallable = onCall(
  { region: "asia-northeast3" },
  async (req) => {
    const { currentJob, newTitle } = req.data as { currentJob: Job; newTitle: Title };

    let composedJobName = "";
    let composedJobDescription = "";

    if (process.env.AI_ENABLED === "true") {
      try {
        const prompt = buildComposedJobPrompt(currentJob, newTitle);
        const aiResult = await generateSituationWithAI(prompt, 0.7);

        if (aiResult) {
          const parsedResult = JSON.parse(aiResult);
          composedJobName = parsedResult.name;
          composedJobDescription = parsedResult.description;
        }
      } catch (e) {
        console.error("AI job composition failed:", e);
      }
    }

    if (!composedJobName || !composedJobDescription) {
      composedJobName = `${newTitle.label} ${currentJob.name}`;
      composedJobDescription = `${currentJob.description} 이 칭호(${newTitle.label})로 인해 새로운 운명을 맞이합니다.`;
    }

    return {
      baseJobId: currentJob.id,
      displayName: composedJobName,
      description: composedJobDescription,
    };
  }
);
