import React, { useState, useEffect, useCallback } from 'react';
import ChatScreen from './screens/ChatScreen';
import { useGameState } from '../../hooks/useGameState';
import { ReincarnationScreen } from '../../src/ui/ReincarnationScreen'; // ReincarnationScreen 임포트

interface ChatMessage {
  role: 'user' | 'npc' | 'system';
  content: string;
}

export default function App() {
  const { gameState, onChoice, getJobTitle, resetGameState } = useGameState();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentChoices, setCurrentChoices] = useState<string[]>([]);
  const [showReincarnation, setShowReincarnation] = useState(false); // 환생 화면 상태 추가

  const npcReactions = [
    "당신은 더 이상 기사로 대우받지 않습니다.",
    "사람들이 당신을 피합니다.",
    "모두가 당신을 잊은 듯합니다.",
  ];

  const addMessage = useCallback((role: ChatMessage['role'], content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
  }, []);

  // 초기 로드 및 게임 상태 변경 시 메시지 및 선택지 설정
  useEffect(() => {
    // 초기 메시지 설정
    if (messages.length === 0 && !showReincarnation) {
      addMessage('npc', '길가에 쓰러진 자가 보인다.');
      setCurrentChoices(['돕는다', '이익을 취한다', '무시한다']);
    }

    // 정체성 Unrecognized 상태일 때 NPC 반응 및 환생 트리거
    if (gameState.identityState === "Unrecognized" && !showReincarnation) {
      const randomReaction = npcReactions[Math.floor(Math.random() * npcReactions.length)];
      addMessage('npc', randomReaction);
      setShowReincarnation(true); // 환생 화면 표시
    }

  }, [gameState.reputation, gameState.identityState, messages, addMessage, npcReactions, showReincarnation]);

  const handleChoiceSelect = useCallback((choice: string) => {
    addMessage('user', `나는 ${choice}한다`);
    setCurrentChoices([]); // 선택 후 버튼 숨김

    // onChoice 로직 호출
    let choiceType: "Help" | "Take_Advantage" | "Betray" | "Ignore";
    switch (choice) {
      case '돕는다':
        choiceType = 'Help';
        break;
      case '이익을 취한다':
        choiceType = 'Take_Advantage';
        break;
      case '무시한다':
        choiceType = 'Ignore';
        break;
      case '배신한다':
        choiceType = 'Betray';
        break;
      default:
        choiceType = 'Ignore';
    }
    onChoice(choiceType);

    // 다음 이벤트 시뮬레이션 (임시)
    setTimeout(() => {
      addMessage('npc', `당신은 ${choice}했다.`);
      let nextChoices: string[] = [];
      if (choiceType === 'Help') {
        addMessage('system', `[+5 명성] 당신의 선택이 빛났다.`);
        nextChoices = ['계속 나아간다', '주변을 살핀다'];
      } else if (choiceType === 'Take_Advantage') {
        addMessage('system', `[+1 골드] 이익을 얻었다.`);
        nextChoices = ['새로운 길을 찾는다'];
      } else if (choiceType === 'Betray') {
        addMessage('system', `[-15 명성] 대가를 치렀다.`);
        nextChoices = ['도망친다', '맞서 싸운다'];
      } else { // 'Ignore' 또는 기타
        addMessage('system', `아무 일도 일어나지 않았다.`);
        nextChoices = ['새로운 길을 찾는다'];
      }
      setCurrentChoices(nextChoices);
    }, 1500); // 1.5초 딜레이
  }, [addMessage, onChoice]);

  // 환생 화면 표시
  if (showReincarnation) {
    return (
      <ReincarnationScreen
        gameState={gameState}
        onContinue={(nextJob) => {
          setShowReincarnation(false);
          resetGameState(nextJob); // 게임 상태 초기화 및 새 직업 전달
          setMessages([]); // 메시지 초기화
          setCurrentChoices([]); // 선택지 초기화
        }}
      />
    );
  }

  return (
    <ChatScreen
      messages={messages}
      choices={currentChoices}
      onChoiceSelect={handleChoiceSelect}
      jobTitle={getJobTitle()}
      reputation={gameState.reputation}
    />
  );
}