import { SituationResultType } from "@/situation/resultType";

export type SituationDebugLog = {
  situationId: string;
  choice: string;
  resultType: SituationResultType;
  nextHint?: string;
};

