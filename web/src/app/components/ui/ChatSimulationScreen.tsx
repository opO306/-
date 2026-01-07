
import { useState } from "react";
import type { NPCMemory } from "../../memory/npcMemory";
import { handleFreeChoice } from "../../freeChoice/handleFreeChoice";
import FreeChoiceInput from "../components/FreeChoiceInput";
import NpcProfileCard from "./NpcProfileCard";

interface ChatMessage {
  sender: "user" | "npc";
  text: string;
  tone?: string;
}

export default function ChatSimulationScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [npcMemories, setNpcMemories] = useState<NPCMemory[]>([]);
  const npcId = "칼리";
  const currentMood = npcMemories.length > 0 ? npcMemories[npcMemories.length - 1].tone : "평온";
  const turn = messages.filter(m => m.sender === "user").length;

  const onSubmit = async (result: {
    outcome: string;
    memory: NPCMemory;
    summary: string;
  }) => {
    setMessages(prev => [
      ...prev,
      { sender: "user", text: result.memory.cause },
      { sender: "npc", text: result.outcome, tone: result.memory.tone }
    ]);
    setNpcMemories(prev => [...prev, result.memory]);
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <NpcProfileCard npcId={npcId} currentMood={currentMood} />
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`max-w-[75%] px-4 py-2 rounded-xl text-sm whitespace-pre-line ${
            msg.sender === "user"
              ? "bg-[#3182F6] text-[#FFFFFF] self-end ml-auto"
              : "bg-[#F2F4F6] text-[#1A1A1A] self-start"
          }`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="p-3 border-t bg-white">
        <FreeChoiceInput
          npcId={npcId}
          memories={npcMemories}
          turn={turn}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}

