import React from "react";

export function RebirthResultModal({
  summary,
  details,
}: {
  summary: string;
  details: string[];
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl">
      <div className="text-lg font-semibold mb-2">
        환생 결과
      </div>

      <div className="text-sm text-gray-600 mb-4">
        {summary}
      </div>

      <ul className="space-y-2 text-sm text-gray-500">
        {details.map((d, i) => (
          <li key={i}>• {d}</li>
        ))}
      </ul>
    </div>
  );
}
