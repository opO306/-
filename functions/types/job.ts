export type JobType = 'diligent' | 'restless' | 'observer' | 'trickster';

export interface Job {
  id: JobType;
  name: string;
  tags: string[];
  description: string;
  perspectivePrompt: string;
  bonuses: { label: string; value: string }[];
}

