import { ButterflyMark } from "@/types/butterfly";
import { ButterflyThreshold } from "@/butterfly/threshold";

export function ButterflyDebug({
  marks,
  thresholds,
}: {
  marks: ButterflyMark[];
  thresholds: ButterflyThreshold[];
}) {
  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">Butterfly Marks</h3>

      <ul className="text-xs space-y-1">
        {marks.slice(-10).map((m, i) => (
          <li key={i}>
            {m.key} (w:{m.weight})
          </li>
        ))}
      </ul>

      <h4 className="mt-4 text-sm font-medium">Threshold Progress</h4>
      {thresholds.map((t) => (
        <div key={t.id} className="text-xs text-gray-500">
          {t.id}
        </div>
      ))}
    </div>
  );
}

