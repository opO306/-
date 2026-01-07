import React, { useState } from 'react';
import { handleFreeChoice } from '../../freeChoice/handleFreeChoice';
import { NPCMemory, MemoryTone } from '../../game/npcMemory';

interface FreeChoiceInputProps {
  npcId: string;
  memories: NPCMemory[];
  turn: number;
  onSubmit: (result: {
    outcome: string;
    tone: MemoryTone;
    memory: NPCMemory;
    summary: string;
    updatedMemories: NPCMemory[];
  }) => void;
}

export const FreeChoiceInput: React.FC<FreeChoiceInputProps> = ({ npcId, memories, turn, onSubmit }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    const result = handleFreeChoice({
      text,
      npcId,
      memories,
      turn,
    });

    if (result) {
      onSubmit(result);
      setText('');
    } else {
      setError('부적절한 입력입니다. 다른 문장을 시도해주세요.');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="NPC에게 할 행동을 입력하세요..."
      />
      <button onClick={handleSubmit}>행동</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

