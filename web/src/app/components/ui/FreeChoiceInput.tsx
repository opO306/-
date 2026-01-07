
import React, { useState } from "react";
import type { NPCMemory } from "../../memory/npcMemory";

interface FreeChoiceInputProps {
  npcId: string;
  memories: NPCMemory[];
  turn: number;
  onSubmit: (result: { outcome: string; memory: NPCMemory; summary: string }) => void;
}

export default function FreeChoiceInput({ npcId, memories, turn, onSubmit }: FreeChoiceInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // 임시로 결과 반환
      onSubmit({
        outcome: "NPC의 임시 응답입니다.",
        memory: { cause: input, effect: "임시 효과", tone: "neutral" },
        summary: "임시 요약"
      });
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 p-2 border rounded-md"
        placeholder="직접 행동을 입력해 보세요"
      />
      <button type="submit" className="px-4 py-2 text-blue-600 rounded-md">
        전송
      </button>
    </form>
  );
}

