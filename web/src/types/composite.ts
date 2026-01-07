import { Job } from "@/types/job";
import { Title } from "@/types/title";

export type CompositeContext = {
  baseJob: Job;
  relevantTitles: Title[];
  archetypeSummary: string;
};
