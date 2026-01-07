import { httpsCallable } from "firebase/functions";
import { functions as appFunctions } from "../firebase/config";
import {
  extractTagsFromTitle,
  autoSelectJob,
  generateJobChoices
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
  const callReincarnationAnalysis = httpsCallable<{ job: string; oath: string; finalIdentity: string; reputationTrend: string; notableBehaviors: string[]; }, { result: string }>(appFunctions, 'requestReincarnationAnalysis');
  const response = await callReincarnationAnalysis(input);
  return response.data.result;
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
