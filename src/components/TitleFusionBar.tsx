import { PlayerTitle } from "@/types/title";
import { useMemo } from "react";

export function TitleFusionBar({
  titles,
  selectedIds,
  onReset,
}: {
  titles: PlayerTitle[];
  selectedIds: string[];
  onReset: () => void;
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="max-w-md mx-auto px-5 py-4">
        <div className="text-sm text-gray-600 mb-2">
          선택된 칭호 {selectedTitles.length}개
        </div>

        <div className="flex gap-2 mb-3">
          {selectedTitles.map((t) => (
            <span
              key={t.id}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs"
            >
              {t.name}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 rounded-xl border py-3 text-sm"
          >
            취소
          </button>

          <button
            disabled={!canFuse}
            className={`flex-1 rounded-xl py-3 text-sm text-white
              ${
                canFuse
                  ? "bg-[#9E7C3A]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            합성하기
          </button>
        </div>
      </div>
    </div>
  );
}

