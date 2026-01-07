import React, { createContext, useContext, useEffect, useReducer, ReactNode } from "react";
import Decimal from "break_infinity.js";
import { TITLE_NODES } from "../../data/titles";
import { Title } from "../../types/title"; // src/types/title에서 Title 타입 임포트
import { ArchetypeVector } from "../../types/archetype"; // ArchetypeVector 타입 임포트
import { ButterflyMark } from "../../types/butterfly"; // ButterflyMark 타입 임포트
import { SituationGenInput } from "../../types/situation"; // ButterflyMark 타입 임포트
import { PlayerTitle } from "../../types/title"; // PlayerTitle 타입 임포트
import { getExpedition } from "../../data/expeditions";
import { MAX_BUTTERFLY_MARKS } from "../../data/balance"; // MAX_BUTTERFLY_MARKS 임포트
import { getFunctions, httpsCallable } from "firebase/functions"; // Firebase Functions 임포트

// ───────────────────────────────── Types
export type OngoingExpedition = {
  id: string;   // expedition id
  end: number;  // unix ms when completes
};

export interface GameState {
  fame: Decimal;
  famePerSec: Decimal;
  alignment: number;                 // -100 ~ +100
  archetype: ArchetypeVector;        // ArchetypeVector 추가
  currentChainLength: number;        // 연쇄 길이 추가
  recentButterflyMarks: ButterflyMark[]; // 최근 N개의 Butterfly Mark 저장
  titles: Record<string, { level: number; xp: Decimal }>;    // id -> { level, xp }
  playerTitles: PlayerTitle[];       // 플레이어가 획득한 칭호 목록
  currentJobId?: string;           // 현재 직업 ID (선택하지 않았으면 undefined)
  jobIntroducedAt?: number;        // 직업이 소개된 시점 (unix ms)
  lastJobSuggestionDeclinedAt?: number; // 직업 제안 거절 시점 (unix ms)
  currentSeason: number;             // 현재 시즌 번호
  expeditions: OngoingExpedition[];  // 진행 중 탐험
  lastTick: number;
  feature: {
    newJobSystem: boolean;
  };
  prestigePoints: Decimal; // PrestigePoints 추가
}

type Action =
  | { type: "TICK"; delta: number }
  | { type: "CHANGE_ALIGNMENT"; delta: number }
  | { type: "CHANGE_ARCHETYPE"; delta: ArchetypeVector } // ArchetypeVector 변화 액션 추가
  | { type: "INCREMENT_CHAIN_LENGTH" } // 연쇄 길이 증가
  | { type: "RESET_CHAIN_LENGTH" } // 연쇄 길이 초기화
  | { type: "ADD_BUTTERFLY_MARK"; mark: ButterflyMark } // Butterfly Mark 추가
  | { type: "GRANT_TITLE"; titleId: string } // 칭호 지급
  | { type: "CONSUME_TITLES"; titleIds: string[] } // 합성 시 칭호 사용 처리
  | { type: "TRIGGER_SEASON_END" } // 시즌 종료 트리거
  | { type: "SET_CURRENT_JOB"; jobId: string; introducedAt: number } // 현재 직업 설정
  | { type: "DECLINE_JOB_SUGGESTION" } // 직업 제안 거절
  | { type: "UNLOCK_TITLE"; id: string }
  | { type: "UPGRADE_TITLE"; id: string }
  | { type: "START_EXPEDITION"; id: string }
  | { type: "COMPLETE_EXPEDITION"; id: string }
  | { type: "GAIN_TITLE_XP"; id: string; amount: Decimal };

// ──────────────────────────────── Initial State
const initialState: GameState = {
  fame: new Decimal(0),
  famePerSec: new Decimal(1),
  alignment: 0,
  archetype: {
    orderChaos: 0,
    altruismSelf: 0,
    asceticHedon: 0,
    knowledgeDestruction: 0,
  },
  currentChainLength: 0, // 연쇄 길이 초기화
  recentButterflyMarks: [], // Butterfly Mark 초기화
  playerTitles: [],          // 플레이어가 획득한 칭호 목록 초기화
  currentJobId: undefined,   // 초기 직업 없음
  jobIntroducedAt: undefined, // 직업 소개 시점 없음
  lastJobSuggestionDeclinedAt: undefined, // 직업 제안 거절 시점 없음
  titles: TITLE_NODES.reduce<Record<string, { level: number; xp: Decimal }>>(
    (acc: Record<string, { level: number; xp: Decimal }>, n: Title) => {
      acc[n.id] = { level: n.id === "citizen" ? 0 : -1, xp: new Decimal(0) };
      return acc;
    },
    {}
  ),
  currentSeason: 1,          // 현재 시즌 번호 초기화
  expeditions: [],
  lastTick: Date.now(),
  feature: {
    newJobSystem: true,
  },
  prestigePoints: new Decimal(0), // PrestigePoints 초기화
};

// ──────────────────────────────── Helpers
const clampAlignment = (v: number) => Math.max(-100, Math.min(100, v));

// ──────────────────────────────── Reducer
function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "TICK": {
      const now = Date.now();
      const gained = state.famePerSec.mul(action.delta / 1000);
      let fame = state.fame.plus(gained);
      let alignment = state.alignment;
      let expeditions = state.expeditions;

      // 완료된 탐험 처리
      const finished = expeditions.filter((e) => e.end <= now);
      if (finished.length) {
        finished.forEach((e) => {
          const def = getExpedition(e.id);
          fame = fame.plus(state.fame.mul(def.fameRewardPct));
          alignment = clampAlignment(alignment + def.alignmentDelta);
        });
        expeditions = expeditions.filter((e) => e.end > now);
      }

      return { ...state, fame, alignment, expeditions, lastTick: now };
    }

    case "CHANGE_ALIGNMENT":
      return { ...state, alignment: clampAlignment(state.alignment + action.delta) };

    case "UNLOCK_TITLE":
      if (state.titles[action.id].level >= 0) return state;
      return { ...state, titles: { ...state.titles, [action.id]: { level: 0, xp: new Decimal(0) } } };

    case "UPGRADE_TITLE": {
      const titleEntry = state.titles[action.id];
      if (titleEntry.level < 0) return state;
      return { ...state, titles: { ...state.titles, [action.id]: { ...titleEntry, level: titleEntry.level + 1 } } };
    }

    case "GAIN_TITLE_XP": {
      const titleData = state.titles[action.id];
      if (titleData.level < 0) return state; // 잠금 상태면 XP 획득 불가

      const titleDef = TITLE_NODES.find(n => n.id === action.id);
      if (!titleDef) return state;

      let newXP = titleData.xp.plus(action.amount);
      let newLevel = titleData.level;
      let newFamePerSec = state.famePerSec;

      // 레벨업 처리
      while (newXP.gte(titleDef.baseXPToNextLevel)) {
        newXP = newXP.minus(titleDef.baseXPToNextLevel);
        newLevel++;
        newFamePerSec = newFamePerSec.plus(titleDef.famePerSecBonus);
        // TODO: 레벨업 애니메이션 트리거 (나중에 UI 컴포넌트에서 처리)
      }

      return {
        ...state,
        famePerSec: newFamePerSec,
        titles: {
          ...state.titles,
          [action.id]: { level: newLevel, xp: newXP },
        },
      };
    }

    case "START_EXPEDITION": {
      const def = getExpedition(action.id);
      if (!def) return state;
      if (state.fame.lt(def.fameCost)) return state; // 자금 부족
      const end = Date.now() + def.duration;
      return {
        ...state,
        fame: state.fame.minus(def.fameCost),
        expeditions: [...state.expeditions, { id: def.id, end }],
      };
    }

    case "CHANGE_ARCHETYPE": {
      const newArchetype = { ...state.archetype };
      for (const axis in action.delta) {
        newArchetype[axis as keyof ArchetypeVector] += action.delta[axis as keyof ArchetypeVector];
      }
      // 성향 변화 기록 로깅
      console.log("Archetype changed:", action.delta, "New archetype:", newArchetype);
      return { ...state, archetype: newArchetype };
    }

    case "INCREMENT_CHAIN_LENGTH":
      return { ...state, currentChainLength: state.currentChainLength + 1 };

    case "RESET_CHAIN_LENGTH":
      return { ...state, currentChainLength: 0 };

    case "ADD_BUTTERFLY_MARK": {
      const newMarks = [...state.recentButterflyMarks, action.mark];
      if (newMarks.length > MAX_BUTTERFLY_MARKS) {
        newMarks.shift(); // 가장 오래된 Mark 제거
      }
      return { ...state, recentButterflyMarks: newMarks };
    }

    case "GRANT_TITLE": {
      const titleDef = TITLE_NODES.find(n => n.id === action.titleId);
      if (!titleDef) return state; // 정의되지 않은 칭호

      // 칭호 중복 방지: 이미 획득한 칭호인지 확인
      if (state.playerTitles.some(t => t.id === action.titleId)) {
        console.log(`Title '${action.titleId}' already granted.`);
        return state;
      }

      const newPlayerTitle = {
        id: titleDef.id,
        name: titleDef.label,
        description: titleDef.description, // 칭호 정의에서 description 사용
        tags: titleDef.tags, // tags 속성을 사용
        state: "active" as const,
      };

      return {
        ...state,
        playerTitles: [...state.playerTitles, newPlayerTitle],
      };
    }

    case "CONSUME_TITLES": {
      const newPlayerTitles = state.playerTitles.map(title => 
        action.titleIds.includes(title.id)
          ? { ...title, state: "consumed" as const }
          : title
      );
      return { ...state, playerTitles: newPlayerTitles };
    }

    case "TRIGGER_SEASON_END": {
      return { ...state, currentSeason: state.currentSeason + 1 };
    }

    case "SET_CURRENT_JOB": {
      return { ...state, currentJobId: action.jobId, jobIntroducedAt: action.introducedAt };
    }

    case "DECLINE_JOB_SUGGESTION": {
      return { ...state, lastJobSuggestionDeclinedAt: Date.now() };
    }

    default:
      return state;
  }
}

// ──────────────────────────────── Context
const Ctx = createContext<[GameState, React.Dispatch<Action>] | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Tick loop
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      const delta = now - state.lastTick;
      dispatch({ type: "TICK", delta });
    }, 50);
    return () => clearInterval(id);
  }, [state.lastTick]);

  // Alignment에 따라 테마 클래스 변경
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-evil", "theme-neutral", "theme-good");

    if (state.alignment <= -40) {
      root.classList.add("theme-evil");
    } else if (state.alignment >= 40) {
      root.classList.add("theme-good");
    } else {
      root.classList.add("theme-neutral");
    }
  }, [state.alignment]);

  return <Ctx.Provider value={[state, dispatch]}>{children}</Ctx.Provider>;
};

export type UseGameTuple = [GameState, React.Dispatch<Action>, (situationId: string, choiceId: string, intentText: string) => Promise<{ success: boolean; error?: undefined; } | { success: boolean; error: unknown; }>, (input: SituationGenInput, currentJobId?: string) => Promise<{ situationText: string; options: string[]; } | undefined>];

export const useGame = (): UseGameTuple => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useGame in Provider");
  const [state, dispatch] = c;

  const functions = getFunctions();
  const classifyIntentCallable = httpsCallable(functions, 'classifyIntent'); // functions/index.ts의 classifyIntent 호출
  const generateSituationCallable = httpsCallable(functions, 'generateSituation'); // functions/index.ts의 generateSituation 호출

  const analyzePlayerIntent = async (situationId: string, choiceId: string, intentText: string) => {
    try {
      const result = await classifyIntentCallable({ situationId, choiceId, intentText }); // classifyIntent 호출
      const { marks } = result.data as { success: boolean; marks: ButterflyMark[] };

      if (marks && marks.length > 0) {
        marks.forEach(mark => dispatch({ type: "ADD_BUTTERFLY_MARK", mark }));
      }
      return { success: true };
    } catch (error) {
      console.error("Error analyzing player intent:", error);
      return { success: false, error };
    }
  };

  const generateGameSituation = async (input: SituationGenInput, currentJobId?: string) => {
    try {
      const result = await generateSituationCallable({ input, currentJobId }); // generateSituation 호출
      const { text, options } = result.data as { text: string; options: string[] };
      return { situationText: text, options };
    } catch (error) {
      console.error("Error generating game situation:", error);
      // Fallback은 Cloud Function에서 처리되므로, 여기서는 에러만 반환
      throw new Error("Failed to generate game situation.");
    }
  };

  return [state, dispatch, analyzePlayerIntent, generateGameSituation];
};