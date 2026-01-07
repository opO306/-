
import React from "react";

interface NpcProfileCardProps {
  npcId: string;
  currentMood: string; // NPC의 현재 상태를 나타내는 새로운 prop 추가
}

// 임시 NPC 데이터 (실제 데이터는 다른 파일에서 가져올 수 있습니다.)
const npcData: { [key: string]: { name: string } } = {
  "칼리": {
    name: "칼리",
  }
};

export default function NpcProfileCard({ npcId, currentMood }: NpcProfileCardProps) {
  const npc = npcData[npcId];

  if (!npc) {
    return null; // NPC를 찾을 수 없으면 아무것도 렌더링하지 않음
  }

  return (
    <div className="p-3 border-b bg-white">
      <div className="text-sm text-neutral-500">
        <span className="font-semibold text-neutral-800">{npc.name}</span> · 현재 상태: {currentMood}
      </div>
    </div>
  );
}

