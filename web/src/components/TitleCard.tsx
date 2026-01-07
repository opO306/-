import { PlayerTitle } from "@/types/title";

export function TitleCard({
  title,
  selected,
  onSelect,
}: {
  title: PlayerTitle;
  selected: boolean;
  onSelect: () => void;
}) {
  const disabled = title.state === "consumed";

  return (
    <button
      disabled={disabled}
      onClick={onSelect}
      className={`
        w-full rounded-2xl bg-white p-5 text-left shadow-sm
        transition border
        ${selected ? "border-[#9E7C3A]" : "border-transparent"}
        ${disabled ? "opacity-40" : ""}
      `}
    >
      <div className="text-lg font-medium">{title.name}</div>
      <div className="text-sm text-gray-500 mt-1">
        {title.description}
      </div>

      {disabled && (
        <div className="mt-2 text-xs text-gray-400">
          다른 칭호에 흡수됨
        </div>
      )}
    </button>
  );
}

