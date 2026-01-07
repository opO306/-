
import React, { useState, useEffect, useRef } from 'react';

interface MessageProps {
  role: 'user' | 'npc' | 'system';
  content: string;
}

const Message: React.FC<MessageProps> = ({ role, content }) => {
  const bubbleClasses = {
    user: 'bg-blue-500 text-white self-end',
    npc: 'bg-gray-700 text-white self-start',
    system: 'bg-yellow-600 text-white self-center text-sm px-3 py-1 rounded-full my-1',
  };

  const alignmentClasses = {
    user: 'justify-end',
    npc: 'justify-start',
    system: 'justify-center',
  };

  return (
    <div className={`flex ${alignmentClasses[role]} mb-2`}>
      {role !== 'system' && (
        <div className={`max-w-[70%] px-4 py-2 rounded-lg shadow ${bubbleClasses[role]}`}>
          {content}
        </div>
      )}
      {role === 'system' && (
        <div className={bubbleClasses[role]}>
          {content}
        </div>
      )}
    </div>
  );
};

interface ChoiceButtonsProps {
  options: string[];
  onSelect: (choice: string) => void;
}

const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({ options, onSelect }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-800 border-t border-gray-700 flex flex-wrap justify-center gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full text-lg"
        >
          👉 {option}
        </button>
      ))}
    </div>
  );
};

interface ChatScreenProps {
  messages: MessageProps[];
  choices: string[];
  onChoiceSelect: (choice: string) => void;
  jobTitle: string;
  reputation: number;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ messages, choices, onChoiceSelect, jobTitle, reputation }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Top Bar for status/titles */}
      <div className="h-12 bg-gray-800 flex items-center justify-center text-sm border-b border-gray-700">
        <span className="text-gray-400">명성: {reputation} | 칭호: {jobTitle}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} content={msg.content} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChoiceButtons options={choices} onSelect={onChoiceSelect} />
    </div>
  );
};

export default ChatScreen;

