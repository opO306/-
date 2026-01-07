import * as admin from "firebase-admin";
import { db } from "../index";
import { Title } from "../types/game";

export type Achievement = {
  id: string;
  titleId: string;
  condition: string; // Simplified condition string for now (e.g., "observed_repeatedly >= 3")
  unlockedAt?: admin.firestore.Timestamp;
};

// Simplified logic to derive achievement condition from title tags
function deriveConditionFromTags(tags: string[]): string {
  if (tags.includes("observed_repeatedly")) {
    return "observed_repeatedly >= 3"; // Example condition
  }
  if (tags.includes("curiosity_expressed")) {
    return "curiosity_expressed >= 2"; // Example condition
  }
  if (tags.includes("ignored_risk")) {
    return "ignored_risk >= 3"; // Example condition
  }
  return ""; // Default or no specific achievement
}

export async function generateAchievementsForTitle(title: Title) {
  const achievementId = `ach_${title.id}`;
  const condition = deriveConditionFromTags(title.tags);

  if (!condition) {
    console.log(`No achievement condition derived for title: ${title.label}`);
    return;
  }

  // Store in a system-wide achievements collection, or per-player upon unlock
  // For now, let's assume a system-wide collection for definition
  const achievementsRef = db.collection("system/achievements/definitions");

  const newAchievement: Achievement = {
    id: achievementId,
    titleId: title.id,
    condition: condition,
  };

  await achievementsRef.doc(achievementId).set(newAchievement, { merge: true });
  console.log(`Achievement '${newAchievement.id}' generated for title '${title.label}'.`);
}

