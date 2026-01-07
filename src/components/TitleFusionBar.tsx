import { PlayerTitle } from "@/types/title";
import { useMemo } from "react";

export function TitleFusionBar({
  titles,
  selectedIds,
  onReset,
  onFuse,
}: {
  titles: PlayerTitle[];
  selectedIds: string[];
  onReset: () => void;
  onFuse?: () => void;
}) {
  const selectedTitles = useMemo(
    () => titles.filter((t) => selectedIds.includes(t.id)),
    [titles, selectedIds]
  );

  const canFuse =
    selectedTitles.length >= 2 &&
    selectedTitles.every((t) => t.state === "active");

  if (selectedTitles.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl">
      <div className="max-w-md mx-auto px-5 py-4">
        <div className="text-sm text-gray-600 mb-2 flex items-center justify-between">
          <span>선택된 칭호 {selectedTitles.length}개</span>
          {canFuse && (
            <span className="text-xs text-purple-600 font-medium animate-pulse">
              ✨ 합성 가능
            </span>
          )}
        </div>

        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
          {selectedTitles.map((t) => (
            <span
              key={t.id}
              className="rounded-full bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-300 px-3 py-1 text-xs font-medium text-purple-700 whitespace-nowrap"
            >
              {t.name}
            </span>
          ))}
        </div>

        {canFuse && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 mb-3 text-xs text-purple-700">
            💡 선택한 칭호들을 합성하여 새로운 칭호를 만들 수 있습니다.
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            취소
          </button>

          <button
            onClick={onFuse}
            disabled={!canFuse}
            className={`flex-1 rounded-xl py-3 text-sm font-medium text-white transition-all
              ${
                canFuse
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            {canFuse ? "✨ 합성하기" : "2개 이상 선택"}
          </button>
        </div>
      </div>
    </div>
  );
}

