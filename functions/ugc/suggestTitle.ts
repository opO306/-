import * as admin from "firebase-admin";
import { db } from "../index";
import { generateSituationWithAI } from "../ai/openaiSituationGenerator"; // 재활용
import { buildTitleTaggingPrompt } from "../ai/buildTitleTaggingPrompt";

const SUGGESTED_TITLES_COLLECTION_REF = db.collection("system/ugc/suggestedTitles");

// Very basic profanity filter for demonstration
function containsProfanity(text: string): boolean {
  const profanities = ["fuck", "shit", "asshole"]; // Example profanities
  return profanities.some(p => text.toLowerCase().includes(p));
}

// Very basic filter for common fantasy words or names (to prevent direct copy)
function containsCommonFantasyNames(text: string): boolean {
  const fantasyNames = ["elven", "dragon", "orc", "elf", "wizard"]; // Example
  return fantasyNames.some(n => text.toLowerCase().includes(n));
}

export async function suggestUserTitle(
  uid: string,
  suggestedName: string
): Promise<boolean> {
  // 1차 자동 필터
  if (
    !suggestedName ||
    suggestedName.length < 2 ||
    suggestedName.length > 15 || // Max length
    containsProfanity(suggestedName) ||
    containsCommonFantasyNames(suggestedName) // Prevent direct copying
  ) {
    console.log("User title suggestion rejected by auto-filter:", suggestedName);
    return false;
  }

  // AI 태그 추론
  let inferredTags: string[] = [];
  if (process.env.AI_ENABLED === "true") {
    try {
      const prompt = buildTitleTaggingPrompt(suggestedName);
      const aiResponse = await generateSituationWithAI(prompt, 0.4); // Low temp for accuracy
      if (aiResponse) {
        inferredTags = aiResponse.split(",").map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
      }
    } catch (e) {
      console.error("AI tag inference failed for suggested title:", suggestedName, e);
    }
  }

  // 보류 큐에 저장
  await SUGGESTED_TITLES_COLLECTION_REF.add({
    suggestedName: suggestedName,
    inferredTags: inferredTags,
    suggestedBy: uid,
    status: "pending_review", // pending_review, approved, rejected
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log("User title suggestion saved for review:", suggestedName);
  return true;
}

