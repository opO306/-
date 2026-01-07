import React from "react";

export function PrestigeProgress() {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-600">환생까지</span>
        <span className="font-medium">80%</span>
      </div>

      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full bg-accent"
          style={{ width: "80%" }}
        />
      </div>

      <div className="mt-2 text-xs text-gray-400">
        환생 시 신규 칭호 가능
      </div>
    </section>
  );
}
