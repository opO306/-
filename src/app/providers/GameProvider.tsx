import React, { createContext, useContext, useEffect, useReducer, ReactNode, useMemo } from "react";
import Decimal from "break_infinity.js";
import { TITLE_NODES } from "../../data/titles";
import { Title } from "../../types/title"; // src/types/title에서 Title 타입 임포트
import { ArchetypeVector } from "../../types/archetype";
import { ButterflyMark, ButterflyAxis } from "../../types/butterfly";
import { SituationGenInput, Situation, IntentType } from "../../types/situation";
import { PlayerTitle } from "../../types/title"; // PlayerTitle 타입 임포트
import { ComposedJob, composeJob } from "../game/jobCompose"; // 칭호 + 직업 합성 함수 임포트
import { getExpedition } from "../../data/expeditions";
import { MAX_BUTTERFLY_MARKS } from "../../data/balance"; // MAX_BUTTERFLY_MARKS 임포트

// ───────────────────────────────── Types
export type OngoingExpedition = {
  id: string;
  end: number;
};

export interface GameState {
  fame: Decimal;
  famePerSec: Decimal;
  alignment: number;
  strength: number; // 새로 추가된 strength 속성
  gold: Decimal; // gold 속성 추가 (Decimal 타입)
  currentSituation?: Situation;
  archetype: ArchetypeVector;
  currentChainLength: number;
  recentButterflyMarks: ButterflyMark[];
  titles: Record<string, { level: number; xp: Decimal }>;
  playerTitles: PlayerTitle[];
  currentJobId?: string;
  jobIntroducedAt?: number;
  lastJobSuggestionDeclinedAt?: number;
  currentSeason: number;
  expeditions: OngoingExpedition[];
  lastTick: number;
  feature: {
    newJobSystem: boolean;
  };
  prestigePoints: Decimal;
  firstSituationChoiceId?: "observe" | "intervene" | "distort"; // 첫 상황 선택지 ID
}

type Action =
  | { type: "TICK"; delta: number }
  | { type: "CHANGE_ALIGNMENT"; delta: number }
  | { type: "CHANGE_ARCHETYPE"; delta: ArchetypeVector }
  | { type: "INCREMENT_CHAIN_LENGTH" }
  | { type: "RESET_CHAIN_LENGTH" }
  | { type: "ADD_BUTTERFLY_MARK"; mark: ButterflyMark }
  | { type: "GRANT_TITLE"; titleId: string }
  | { type: "CONSUME_TITLES"; titleIds: string[] }
  | { type: "TRIGGER_SEASON_END" }
  | { type: "SET_CURRENT_JOB"; jobId: string; introducedAt: number }
  | { type: "DECLINE_JOB_SUGGESTION" }
  | { type: "UNLOCK_TITLE"; id: string; cost: Decimal }
  | { type: "UPGRADE_TITLE"; id: string; cost: Decimal }
  | { type: "START_EXPEDITION"; id: string }
  | { type: "COMPLETE_EXPEDITION"; id: string }
  | { type: "GAIN_TITLE_XP"; id: string; amount: Decimal }
  | { type: "SET_SITUATION"; situation: Situation | undefined }
  | { type: "SET_FIRST_SITUATION_CHOICE"; choiceId: "observe" | "intervene" | "distort" }
  | { type: "UPDATE_ARCHETYPE_FROM_MARKS"; marks: ButterflyMark[] }
  | { type: "REBIRTH"; baseJob: string; title: string }; // REBIRTH 액션 타입 변경

// ──────────────────────────────── Helpers & Costs
export const getTitleUnlockCost = (tier: number) => {
  if (tier === 0) return new Decimal(0);
  return new Decimal(100).mul(Decimal.pow(10, tier));
};

export const getTitleUpgradeCost = (tier: number, level: number) => {
  const base = new Decimal(10).mul(Decimal.pow(5, tier));
  return base.mul(Decimal.pow(1.5, level));
};

const clampAlignment = (v: number) => Math.max(-100, Math.min(100, v));

// ──────────────────────────────── Initial State
const initialState: GameState = {
  fame: new Decimal(0),
  famePerSec: new Decimal(0), // 초기 0
  alignment: 0,
  strength: 0, // strength 초기값 추가
  gold: new Decimal(0), // gold 초기값 추가 (Decimal 타입)
  archetype: {
    orderChaos: 0,
    altruismSelf: 0,
    asceticHedon: 0,
    knowledgeDestruction: 0,
  },
  currentChainLength: 0,
  recentButterflyMarks: [],
  playerTitles: [],
  currentJobId: "citizen", // 초기 직업 설정
  jobIntroducedAt: undefined,
  lastJobSuggestionDeclinedAt: undefined,
  titles: TITLE_NODES.reduce<Record<string, { level: number; xp: Decimal }>>(
    (acc, n) => {
      // Citizen은 0레벨(해금), 나머지는 -1(잠금)
      acc[n.id] = { level: n.id === "citizen" ? 0 : -1, xp: new Decimal(0) };
      return acc;
    },
    {}
  ),
  currentSeason: 1,
  expeditions: [],
  lastTick: Date.now(),
  feature: {
    newJobSystem: true,
  },
  prestigePoints: new Decimal(0),
  firstSituationChoiceId: undefined,
};

// ──────────────────────────────── Reducer
function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "TICK": {
      const now = Date.now();
      const gained = state.famePerSec.mul(action.delta / 1000);
      let fame = state.fame.plus(gained);
      let alignment = state.alignment;
      let expeditions = state.expeditions;

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

    case "UNLOCK_TITLE": {
      if (state.fame.lt(action.cost)) return state;
      const current = state.titles[action.id];
      if (current && current.level >= 0) return state; // 이미 해금됨

      // 해금 시 0레벨, Fame 소모
      // 해금 시 기본 생산량 증가 로직이 필요하다면 여기서 famePerSec 재계산
      const titleDef = TITLE_NODES.find(n => n.id === action.id);
      const bonus = titleDef ? titleDef.famePerSecBonus : new Decimal(0);

      return { 
        ...state, 
        fame: state.fame.minus(action.cost),
        famePerSec: state.famePerSec.plus(bonus),
        titles: { ...state.titles, [action.id]: { level: 0, xp: new Decimal(0) } } 
      };
    }

    case "UPGRADE_TITLE": {
      const current = state.titles[action.id];
      if (!current || current.level < 0) return state;
      if (state.fame.lt(action.cost)) return state;

      const titleDef = TITLE_NODES.find(n => n.id === action.id);
      const bonus = titleDef ? titleDef.famePerSecBonus : new Decimal(0);

      return { 
        ...state, 
        fame: state.fame.minus(action.cost),
        famePerSec: state.famePerSec.plus(bonus), // 레벨업 시 보너스 추가 (단순 합산 예시)
        titles: { ...state.titles, [action.id]: { ...current, level: current.level + 1 } } 
      };
    }

    // ... (나머지 케이스는 기존 코드 유지)
    case "START_EXPEDITION": {
      const def = getExpedition(action.id);
      if (!def) return state;
      if (state.fame.lt(def.fameCost)) return state; 
      const end = Date.now() + def.duration;
      return {
        ...state,
        fame: state.fame.minus(def.fameCost),
        expeditions: [...state.expeditions, { id: def.id, end }],
      };
    }
    
    // ... (기존 코드들)
    case "SET_SITUATION": {
      return { ...state, currentSituation: action.situation };
    }

    case "SET_FIRST_SITUATION_CHOICE": {
      return { ...state, firstSituationChoiceId: action.choiceId };
    }

    case "UPDATE_ARCHETYPE_FROM_MARKS": {
      let newArchetype = { ...state.archetype };
      action.marks.forEach(mark => {
        if (mark.axisImpact) {
          (Object.keys(mark.axisImpact) as ButterflyAxis[]).forEach(axis => {
            newArchetype[axis] += (mark.axisImpact as any)[axis] * (mark.weight || 1);
          });
        }
      });
      return { ...state, archetype: newArchetype };
    }

    case "REBIRTH": {
      const composedJob = composeJob(action.baseJob, action.title); // 합성 함수 사용
      return {
        ...initialState, // 초기 상태로 리셋
        currentJobId: composedJob.baseJobId,
        jobIntroducedAt: Date.now(),
        archetype: { // MVP에서는 환생 후 성향 벡터 초기화
          orderChaos: 0,
          altruismSelf: 0,
          asceticHedon: 0,
          knowledgeDestruction: 0,
        },
        recentButterflyMarks: [], // 나비 효과 로그 초기화
        currentSeason: state.currentSeason + 1, // 시즌 증가
      };
    }

    default:
      return state;
  }
}

// ──────────────────────────────── Context & Hook
// computed 타입 정의
export interface GameComputed {
  totalFamePerSec: Decimal;
  nextUnlocks: Title[];
}

// Hook 리턴 타입 확장
export type UseGameTuple = {
  state: GameState;
  dispatch: React.Dispatch<Action>;
  computed: GameComputed;
  actions: {
    analyzePlayerIntent: (situationId: string, choiceId: string, intentText: string) => Promise<{ success: boolean; error?: any }>;
    generateGameSituation: (input: SituationGenInput, currentJobId?: string) => Promise<{ situationText: string; options: string[] } | undefined>;
    unlockTitle: (id: string, tier: number) => void;
    upgradeTitle: (id: string, tier: number, currentLevel: number) => void;
  };
  getJobTitle: () => string; // getJobTitle 함수 추가
};

const Ctx = createContext<UseGameTuple | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  // @ts-ignore: Reducer 초기화 시점 이슈 방지
  const [state, dispatch] = useReducer(reducer, initialState);

  // Computed Values 계산
  const computed = useMemo<GameComputed>(() => {
    // 예: 다음에 해금 가능한 타이틀 찾기 (부모가 해금된 자식들)
    const nextUnlocks = TITLE_NODES.filter(node => {
        if (state.titles[node.id].level >= 0) return false; // 이미 해금됨
        if (!node.parentId) return true; // 루트 노드
        return state.titles[node.parentId].level >= 0; // 부모가 해금됨
    });

    return {
      totalFamePerSec: state.famePerSec,
      nextUnlocks
    };
  }, [state.titles, state.famePerSec]);

  // getJobTitle 함수 구현
  const getJobTitle = useCallback(() => {
    const currentJobName = state.currentJobId || "citizen"; // currentJobId가 없으면 "citizen" 기본값
    // AI가 부여한 칭호는 아직 GameState에 없으므로 임시로 ""를 사용합니다.
    // 이 부분은 AI 연동 후 실제 칭호 문자열로 교체해야 합니다.
    const composed = composeJob(currentJobName, ""); 
    return composed.displayName;
  }, [state.currentJobId]);

  // Actions Wrapper
  const actions = useMemo(() => ({
    analyzePlayerIntent: async (situationId: string, choiceId: string, intentText: string) => {
      // 첫 상황일 경우 firstSituationChoiceId를 저장
      if (state.currentChainLength === 0 && !state.firstSituationChoiceId) {
        if (["observe", "intervene", "distort"].includes(choiceId)) {
          dispatch({ type: "SET_FIRST_SITUATION_CHOICE", choiceId: choiceId as "observe" | "intervene" | "distort" });
        }
      }

      // choiceId를 IntentType으로 매핑 (MVP는 간단한 매핑 사용)
      let determinedIntentType: IntentType | undefined;
      // TODO: 선택지에 따른 IntentType 매핑 로직 구현
      // 임시로 choiceId를 직접 IntentType으로 사용한다고 가정 (실제로는 더 복잡한 매핑 필요)
      if (Object.keys(INTENT_MARK_RULES).includes(choiceId as IntentType)) {
        determinedIntentType = choiceId as IntentType;
      } else {
        // 기본값 또는 에러 처리
        console.warn(`Unknown choiceId as IntentType: ${choiceId}, using 'cautious' as fallback.`);
        determinedIntentType = "cautious"; // 임시 폴백
      }

      if (determinedIntentType) {
        const generatedMark: ButterflyMark = {
          key: `intent_${determinedIntentType}`,
          axisImpact: INTENT_MARK_RULES[determinedIntentType],
          weight: 1,
          createdAt: Date.now(),
        };
        dispatch({ type: "ADD_BUTTERFLY_MARK", mark: generatedMark });
        dispatch({ type: "UPDATE_ARCHETYPE_FROM_MARKS", marks: [generatedMark] });
      }

      return { success: true };
    },
    generateGameSituation: async (input: SituationGenInput, currentJobId?: string) => {
        // (기존 로직 유지)
        return undefined; 
    },
    unlockTitle: (id: string, tier: number) => {
        const cost = getTitleUnlockCost(tier);
        dispatch({ type: "UNLOCK_TITLE", id, cost });
    },
    upgradeTitle: (id: string, tier: number, currentLevel: number) => {
        const cost = getTitleUpgradeCost(tier, currentLevel);
        dispatch({ type: "UPGRADE_TITLE", id, cost });
    }
  }), [dispatch, state.fame, state.titles, state.currentChainLength, state.alignment, state.archetype, state.recentButterflyMarks, state.playerTitles, state.currentJobId, state.jobIntroducedAt, state.lastJobSuggestionDeclinedAt, state.currentSeason, state.expeditions, state.lastTick, state.feature, state.prestigePoints]);

  // Tick
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      const delta = now - state.lastTick;
      dispatch({ type: "TICK", delta: Math.max(0, delta) }); // delta 음수 방지
    }, 100); // 50ms -> 100ms (최적화)
    return () => clearInterval(id);
  }, [state.lastTick]);

  // Theme effect
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-evil", "theme-neutral", "theme-good");
    if (state.alignment <= -40) root.classList.add("theme-evil");
    else if (state.alignment >= 40) root.classList.add("theme-good");
    else root.classList.add("theme-neutral");
  }, [state.alignment]);

  return <Ctx.Provider value={{ state, dispatch, computed, actions, getJobTitle }}>{children}</Ctx.Provider>;
};

export const useGame = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useGame in Provider");
  return c;
};