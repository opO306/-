import React from "react";

export function IdentityCard({
  title,
  description,
  bonuses,
}: {
  title: string;
  description: string;
  bonuses: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="text-xs text-gray-400 mb-1">파생 직업</div>
      <div className="text-xl font-semibold">{title}</div>
      <div className="mt-1 text-sm text-gray-500">{description}</div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {bonuses.map((b) => (
          <div
            key={b.label}
            className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm"
          >
            <span className="text-gray-600">{b.label}</span>
            <span className="font-medium text-accent">{b.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
