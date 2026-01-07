import React from "react";

export function PrestigeProgress({
  progress,
  message,
  onRebirth,
}: {
  progress: number; // 0-100 사이의 숫자
  message: string;
  onRebirth?: () => void;
}) {
  const canRebirth = progress >= 100;

  return (
    <section className="rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 p-5 shadow-sm border border-orange-200">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">♾️</span>
          <span className="font-semibold text-gray-800">환생 진행도</span>
        </div>
        <span className="font-bold text-orange-600">{Math.min(progress, 100)}%</span>
      </div>

      <div className="h-3 rounded-full bg-gray-200 overflow-hidden mb-3 relative">
        <div
          className={`h-full transition-all duration-500 ${
            canRebirth 
              ? "bg-gradient-to-r from-orange-500 to-red-500 animate-pulse-slow" 
              : "bg-gradient-to-r from-orange-400 to-red-400"
          }`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <div className="text-xs text-gray-600 mb-3">
        💡 {message}
      </div>

      {canRebirth && onRebirth && (
        <button
          onClick={onRebirth}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          ✨ 환생하기 (새로운 칭호 발견)
        </button>
      )}

      {!canRebirth && (
        <div className="text-xs text-gray-500 text-center p-2 bg-white/50 rounded">
          반복 플레이를 통해 더 많은 칭호를 발견하세요
        </div>
      )}
    </section>
  );
}
