import * as admin from "firebase-admin";
import { CompositeJob } from "../types/game";

export function generateCompositeJob(
  baseJobId: string,
  activeTitleId: string
): CompositeJob {
  let compositeJobName: string;
  let toneTags: string[] = [];

  // Simplified logic for composite job name and tone tags
  // This can be expanded with more complex rules or LLM calls in the future
  if (baseJobId === "mage" && activeTitleId === "record_keeper") {
    compositeJobName = "네크로멘서";
    toneTags.push("dark_magic", "scholarly");
  } else if (baseJobId === "knight" && activeTitleId === "force_obsessed") {
    compositeJobName = "광전사";
    toneTags.push("aggressive", "uncontrolled");
  } else if (baseJobId === "rogue" && activeTitleId === "observer") {
    compositeJobName = "그림자감시자";
    toneTags.push("stealthy", "watchful");
  } else {
    // Fallback for other combinations
    compositeJobName = `${baseJobId} ${activeTitleId}`;
    toneTags.push("generic");
  }

  return {
    id: `${baseJobId}_${activeTitleId}`,
    name: compositeJobName,
    toneTags: toneTags,
    baseJobId: baseJobId,
    activeTitleId: activeTitleId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
}

