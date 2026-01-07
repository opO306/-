import * as admin from "firebase-admin";
import { Title } from "../types/game";
import { generateSituationWithAI } from "../ai/openaiSituationGenerator"; // LLM for name generation
import { buildSynthesizedTitlePrompt } from "../ai/buildSynthesizedTitlePrompt";
import { SummarizedBehavior } from "../../src/freeChoice/summarizeSeasonBehavior"; // SummarizedBehavior 임포트

export function mergeTags(tagsA: string[], tagsB: string[]): string[] {
  const allTags = [...tagsA, ...tagsB];
  const tagCounts: Record<string, number> = {};
  allTags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });

  // Simple conflict resolution: remove tags that are direct opposites if defined
  // For now, no complex opposite logic, just merge and count

  return Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
}

export function pickDominantTags(tags: string[], count: number): string[] {
  return tags.slice(0, count);
}

export async function generateSynthesizedTitle(
  titleA: Title,
  titleB: Title,
  existingTitleIds: string[]
): Promise<Title> {
  const merged = mergeTags(titleA.tags, titleB.tags);
  const finalTags = pickDominantTags(merged, 3); // Pick top 3 dominant tags

  let name = "";
  // Use AI to generate a name based on tags
  if (process.env.AI_ENABLED === "true") {
    try {
      const prompt = buildSynthesizedTitlePrompt(finalTags);
      const aiName = await generateSituationWithAI(prompt, 0.7); // Higher temperature for creativity
      if (aiName) name = aiName;
    } catch (e) {
      console.error("AI title generation failed:", e);
    }
  }

  if (!name) {
    name = `${titleA.label}-${titleB.label}-합성`; // Fallback name
  }

  // Generate a unique ID (simple hash for now)
  const idBase = `${titleA.id}-${titleB.id}-${name}`;
  let id = Buffer.from(idBase).toString('base64').substring(0, 10); // Simple ID generation
  let counter = 0;
  while (existingTitleIds.includes(id)) {
    id = `${Buffer.from(idBase + counter).toString('base64').substring(0, 10)}`;
    counter++;
  }

  return {
    id: id,
    label: name,
    tags: finalTags,
    source: "synthesized",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
}

export async function generateTitleFromBehavior(
  behavior: SummarizedBehavior,
  existingTitleIds: string[]
): Promise<Title> {
  const tags: string[] = [behavior.dominantTone, behavior.causeKeyword];
  const finalTags = pickDominantTags(tags, 2); // 행동 기반이므로 2개 태그 선택

  let name = "";
  if (process.env.AI_ENABLED === "true") {
    try {
      const prompt = buildSynthesizedTitlePrompt(finalTags, behavior); // 행동 기반 프롬프트에 behavior 추가
      const aiName = await generateSituationWithAI(prompt, 0.8); // 더 높은 온도로 창의적인 이름 생성
      if (aiName) name = aiName;
    } catch (e) {
      console.error("AI title generation from behavior failed:", e);
    }
  }

  if (!name) {
    name = `${behavior.dominantTone}-${behavior.causeKeyword}-칭호`; // Fallback name
  }

  const idBase = `${behavior.dominantTone}-${behavior.causeKeyword}-${name}`;
  let id = Buffer.from(idBase).toString('base64').substring(0, 10);
  let counter = 0;
  while (existingTitleIds.includes(id)) {
    id = `${Buffer.from(idBase + counter).toString('base64').substring(0, 10)}`;
    counter++;
  }

  return {
    id: id,
    label: name,
    tags: finalTags,
    source: "behavior",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
}

