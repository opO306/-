import { ArchetypeDebug } from "./ArchetypeDebug";
import { ButterflyDebug } from "./ButterflyDebug";
import { SituationFlowDebug } from "./SituationFlowDebug";
import { ButterflyMark } from "@/types/butterfly";
import { ButterflyThreshold } from "@/butterfly/threshold";
import { SituationDebugLog } from "./types";

// ArchetypeVector 타입은 프로젝트의 archetype 정의에 따라 달라집니다.
// 여기서는 간단히 Record<string, number>로 가정합니다.
type ArchetypeVector = Record<string, number>;

export function DebugPanel({
  archetype,
  marks,
  thresholds,
  situationLogs,
}: {
  archetype: ArchetypeVector;
  marks: ButterflyMark[];
  thresholds: ButterflyThreshold[];
  situationLogs: SituationDebugLog[];
}) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50">
      <div className="absolute right-0 top-0 h-full w-[320px] bg-white p-4 overflow-y-auto">
        <ArchetypeDebug archetype={archetype} />
        <ButterflyDebug marks={marks} thresholds={thresholds} />
        <SituationFlowDebug logs={situationLogs} />
      </div>
    </div>
  );
}

