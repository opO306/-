import { useState } from "react";
import { PlayerTitle } from "@/types/title";
import { TitleCard } from "@/components/TitleCard";
import { TitleFusionBar } from "@/components/TitleFusionBar";

const mockTitles: PlayerTitle[] = [
  {
    id: "corpse_collector",
    name: "시체수집가",
    description: "죽음을 수집하는 자",
    tags: ["corpse", "death"],
    state: "active",
  },
  {
    id: "ascetic_novice",
    name: "금욕의 초심자",
    description: "욕망을 억제한 자",
    tags: ["ascetic"],
    state: "active",
  },
];

export default function TitleCodexScreen() {
  const [titles, setTitles] = useState<PlayerTitle[]>(mockTitles);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id]
    );
  };

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-5 pt-6 pb-32">
      <h1 className="text-xl font-semibold mb-4">칭호 도감</h1>

      <div className="space-y-3">
        {titles.map((t) => (
          <TitleCard
            key={t.id}
            title={t}
            selected={selected.includes(t.id)}
            onSelect={() => toggleSelect(t.id)}
          />
        ))}
      </div>

      <TitleFusionBar
        titles={titles}
        selectedIds={selected}
        onReset={() => setSelected([])}
      />
    </main>
  );
}

