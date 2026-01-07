import { useState, useEffect, useCallback } from 'react';
import { GameState, ChoiceLog } from '../types/game';
import { Job } from '../game/jobMapping'; // Job 타입 임포트

const initialGameState: GameState = {
  time: 0,
  gold: 0,
  strength: 0, // strength 초기값 추가
  baseJob: "Knight",
  oath: "Chivalry",
  reputation: 0,
  identityState: "Unrecognized", // 초기 상태는 Unrecognized로 시작
  logs: {
    choices: [],
  },
};

// 랜덤 직업을 얻는 헬퍼 함수
function getRandomJob(): "Knight" | "Citizen" | "Scholar" {
  const jobs = ["Knight", "Citizen", "Scholar"] as const;
  return jobs[Math.floor(Math.random() * jobs.length)];
}

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  // 명성 기반 정체성 상태 업데이트 로직
  const updateIdentityState = useCallback((rep: number) => {
    if (rep >= 40) return "Honorable";
    if (rep >= 10) return "Questioned";
    if (rep >= 0) return "Dishonored";
    if (rep >= -40) return "Infamous";
    return "Unrecognized";
  }, []);

  // 방치 루프 (1초/1틱)
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        const newReputation = prev.reputation; // 명성은 틱마다 변하지 않음
        const newIdentityState = updateIdentityState(newReputation);

        return {
          ...prev,
          time: prev.time + 1,
          gold: prev.gold + 1, // 1초에 1골드 자동 증가
          identityState: newIdentityState,
        };
      });
    }, 1000); // 1초마다 실행

    return () => clearInterval(interval);
  }, [updateIdentityState]);

  // 선택 처리 로직
  const onChoice = useCallback((choiceType: string) => {
    setGameState((prev) => {
      const newChoices = [...prev.logs.choices, { type: choiceType, timestamp: prev.time }];
      let newReputation = prev.reputation;

      // 3-1. 선택에 따른 명성 변화 (기사 + 기사도 서약 예시)
      if (prev.baseJob === "Knight" && prev.oath === "Chivalry") {
        switch (choiceType) {
          case "Help":
            newReputation += 5;
            break;
          case "Take_Advantage":
            newReputation += 0;
            break;
          case "Betray":
            newReputation -= 15;
            break;
          default:
            break;
        }
      }

      // 명성 범위 제한 (-100 ~ +100)
      newReputation = Math.max(-100, Math.min(100, newReputation));

      const newIdentityState = updateIdentityState(newReputation);

      return {
        ...prev,
        reputation: newReputation,
        identityState: newIdentityState,
        logs: {
          ...prev.logs,
          choices: newChoices,
        },
      };
    });
  }, [updateIdentityState]);

  // 직업 호칭 계산
  const getJobTitle = useCallback(() => {
    if (gameState.baseJob === "Knight") {
      switch (gameState.identityState) {
        case "Honorable":
          return "기사";
        case "Questioned":
          return "타락한 기사";
        case "Dishonored":
          return "타락한 기사";
        case "Infamous":
          return "악명 높은 기사";
        case "Unrecognized":
          return "알 수 없는 기사"; // 박탈 상태 (조건: Unrecognized)
        default:
          return "기사";
      }
    }
    return gameState.baseJob; // 다른 직업은 아직 구현하지 않으므로 기본 직업 이름 반환
  }, [gameState.baseJob, gameState.identityState]);

  // 게임 상태 초기화 함수
  const resetGameState = useCallback((nextJob?: Job) => {
    setGameState({
      ...initialGameState,
      baseJob: nextJob || getRandomJob(), // nextJob이 있으면 사용, 없으면 랜덤 직업
      reputation: 20, // 초기 명성 설정
      identityState: "Questioned", // 초기 정체성 상태 설정
    });
  }, []);

  return { gameState, onChoice, getJobTitle, resetGameState };
};