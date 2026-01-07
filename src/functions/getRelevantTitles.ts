import { Title } from "@/types/title";
import { ArchetypeVector } from "@/types/archetype";
import { Job } from "@/types/job";
import { TITLE_NODES } from "@/data/titles"; // Assuming TITLE_NODES contains all possible titles

export function getRelevantTitles(
  baseJob: Job,
  currentArchetype: ArchetypeVector,
  playerLog: any[], // Placeholder for player log
  lastActions: any[] // Placeholder for last actions
): Title[] {
  // For now, return all titles as a placeholder.
  // In a real implementation, this would filter titles based on:
  // - currentArchetype (e.g., highly chaotic titles for chaotic players)
  // - playerLog (e.g., titles related to frequently performed actions)
  // - lastActions (e.g., titles triggered by recent specific actions)
  // - baseJob (e.g., titles compatible with the current job's tags)

  // Filter out unlocked titles only
  return TITLE_NODES.filter(title => title.unlocked);
}
