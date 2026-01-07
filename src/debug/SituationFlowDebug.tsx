import { SituationDebugLog } from "./types";

export function SituationFlowDebug({
  logs,
}: {
  logs: SituationDebugLog[];
}) {
  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">Situation Chain</h3>
      <ul className="text-xs space-y-2">
        {logs.map((l, i) => (
          <li key={i}>
            #{i + 1} {l.choice} → {l.resultType}
          </li>
        ))}
      </ul>
    </div>
  );
}

