import React, { createContext, useContext, useEffect, useReducer, ReactNode, useMemo, useCallback, useState } from "react";
import Decimal from "break_infinity.js";
import { TITLE_NODES } from "../../data/titles";
import { Title } from "../../types/title"; // src/types/title에서 Title 타입 임포트
import { ArchetypeVector } from "../../types/archetype";
import { ButterflyMark } from "../../types/butterfly";
import { Situation } from "../../types/situation";
import { PlayerTitle } from "../../types/title"; // PlayerTitle 타입 임포트
import { ChoiceLog } from "../../types/game"; // ChoiceLog 임포트
import { httpsCallable } from "firebase/functions";
import { doc, getDoc } from "firebase/firestore"; // Firestore 관련 임포트
import { functions as appFunctions, db } from "../../firebase/config"; // db 임포트
import { JOBS } from "../../data/jobs"; // JOBS 임포트
import { composeJob } from "../../game/jobCompose"; // 칭호 + 직업 합성 함수 임포트
import { getExpedition } from "../../data/expeditions";

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
  time: number; // time 속성 추가
  baseJob: "Knight" | "Citizen" | "Scholar"; // baseJob 속성 추가
  oath?: "Chivalry" | null; // oath 속성 추가
  reputation: number; // reputation 속성 추가
  identityState: "Honorable" | "Questioned" | "Dishonored" | "Infamous" | "Unrecognized"; // identityState 속성 추가
  logs: {
    choices: ChoiceLog[];
  };
  currentSituation?: Situation;
  archetype: ArchetypeVector;
  currentChainLength: number;
  recentButterflyMarks: ButterflyMark[];
  titles: Record<string, { level: number; xp: Decimal }>;
  playerTitles: PlayerTitle[];
  currentJobId?: string;
  currentTitleId?: string; // titleId 속성 추가
  compositeId?: string; // compositeId 속성 추가
  jobIntroducedAt?: number;
  lastJobSuggestionDeclinedAt?: number;
  currentCompositeDisplayName?: string; // Add this line
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
  | { type: "REBIRTH"; baseJob: string; title: string; composedJobDisplayName?: string; } // composedJobDisplayName 추가
  | { type: "CHOICE"; choiceType: string }
  | { type: "LOAD_GAME_STATE"; payload: GameState } // 새로운 액션 타입 추가
  | { type: "RESET_GAME"; nextJob?: string }; // RESET_GAME 액션 추가

// 랜덤 직업을 얻는 헬퍼 함수
function getRandomJob(): "Knight" | "Citizen" | "Scholar" {
  const jobs = ["Knight", "Citizen", "Scholar"] as const;
  return jobs[Math.floor(Math.random() * jobs.length)];
}

// 명성 기반 정체성 상태 업데이트 로직
const updateIdentityState = (rep: number) => {
  if (rep >= 40) return "Honorable";
  if (rep >= 10) return "Questioned";
  if (rep >= 0) return "Dishonored";
  if (rep >= -40) return "Infamous";
  return "Unrecognized";
};

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
  time: 0, // time 초기값 추가
  baseJob: "Knight", // baseJob 초기값 추가
  oath: "Chivalry", // oath 초기값 추가
  reputation: 0, // reputation 초기값 추가
  identityState: "Unrecognized", // identityState 초기값 추가
  logs: {
    choices: [],
  },
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
  currentCompositeDisplayName: undefined, // Add this line
  currentSeason: 1,
  expeditions: [],
  lastTick: Date.now(),
  feature: {
    newJobSystem: true,
  },
  prestigePoints: new Decimal(0),
  firstSituationChoiceId: undefined,
  titles: TITLE_NODES.reduce<Record<string, { level: number; xp: Decimal }>>(
    (acc, n) => {
      // Citizen은 0레벨(해금), 나머지는 -1(잠금)
      acc[n.id] = { level: n.id === "citizen" ? 0 : -1, xp: new Decimal(0) };
      return acc;
    },
    {}
  ),
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

      // GameState에 추가된 time, gold, identityState, reputation 업데이트
      const newReputation = state.reputation; // 명성은 틱마다 변하지 않음
      const newIdentityState = updateIdentityState(newReputation);
      const newGold = state.gold.plus(1); // 1초에 1골드 자동 증가

      const finished = expeditions.filter((e) => e.end <= now);
      if (finished.length) {
        finished.forEach((e) => {
          const def = getExpedition(e.id);
          fame = fame.plus(state.fame.mul(def.fameRewardPct));
          alignment = clampAlignment(alignment + def.alignmentDelta);
        });
        expeditions = expeditions.filter((e) => e.end > now);
      }
      return { ...state, fame, alignment, expeditions, lastTick: now, time: state.time + 1, gold: newGold, identityState: newIdentityState };
    }

    case "CHOICE": {
      const newChoices = [...state.logs.choices, { type: action.choiceType, timestamp: state.time }];
      let newReputation = state.reputation;

      // 선택에 따른 명성 변화 (기사 + 기사도 서약 예시)
      if (state.baseJob === "Knight" && state.oath === "Chivalry") {
        switch (action.choiceType) {
          case "Help":
            newReputation = newReputation + 5;
            break;
          case "Take_Advantage":
            newReputation = newReputation + 0;
            break;
          case "Betray":
            newReputation = newReputation - 15;
            break;
          default:
            break;
        }
      }

      // 명성 범위 제한 (-100 ~ +100)
      newReputation = Math.max(-100, Math.min(100, newReputation));
      const newIdentityState = updateIdentityState(newReputation);

      return {
        ...state,
        reputation: newReputation,
        identityState: newIdentityState,
        logs: {
          ...state.logs,
          choices: newChoices,
        },
      };
    }

    case "RESET_GAME": {
      const nextJob = action.nextJob || getRandomJob();
      return {
        ...initialState, // 초기 상태로 리셋
        baseJob: nextJob as "Knight" | "Citizen" | "Scholar",
        reputation: 20, // 초기 명성 설정
        identityState: "Questioned", // 초기 정체성 상태 설정
        currentSeason: state.currentSeason + 1, // 시즌 증가
      };
    }

    case "LOAD_GAME_STATE": {
      return { ...action.payload, lastTick: Date.now() }; // 로드된 상태를 반환하고 lastTick 업데이트
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
          (Object.keys(mark.axisImpact) as Array<keyof typeof newArchetype>).forEach(axis => {
            newArchetype[axis] += (mark.axisImpact as any)[axis] * (mark.weight || 1);
          });
        }
      });
      return { ...state, archetype: newArchetype };
    }

    case "REBIRTH": {
      const baseJob = JOBS[action.baseJob];
      // `composeJob`을 리듀서 외부에서 호출하도록 변경되었으므로, 여기서는 `action.composedJobDisplayName`을 사용합니다.
      // 만약 `composedJobDisplayName`이 제공되지 않으면 기존 `action.title`을 폴백으로 사용합니다.
      const composedDisplayName = action.composedJobDisplayName || action.title;

      return {
        ...initialState, // 초기 상태로 리셋
        currentJobId: baseJob.id, // baseJob.id를 사용
        jobIntroducedAt: Date.now(),
        archetype: { // MVP에서는 환생 후 성향 벡터 초기화
          orderChaos: 0,
          altruismSelf: 0,
          asceticHedon: 0,
          knowledgeDestruction: 0,
        },
        recentButterflyMarks: [], // 나비 효과 로그 초기화
        currentSeason: state.currentSeason + 1, // 시즌 증가
        currentCompositeDisplayName: composedDisplayName, // Add this line
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
    analyzePlayerIntent: (choiceId: string) => Promise<{ success: boolean; error?: any }>;
    generateGameSituation: () => Promise<{ situationText: string; options: string[] } | undefined>;
    unlockTitle: (id: string, tier: number) => void;
    upgradeTitle: (id: string, tier: number, currentLevel: number) => void;
  };
  jobTitle: string; // getJobTitle 함수 대신 jobTitle 상태를 직접 노출
  onChoice: (choiceType: string) => void; // onChoice 함수 추가
  resetGameState: (nextJob?: string) => void; // resetGameState 함수 추가
};

const Ctx = createContext<UseGameTuple | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [jobTitle, setJobTitle] = useState<string>(""); // jobTitle 상태 추가
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState<string | null>(null); // 오류 상태 추가

  useEffect(() => {
    const loadGameState = async () => {
      try {
        setLoading(true);
        // 사용자 ID는 인증 컨텍스트에서 가져와야 하지만, 현재는 'testUser'로 가정합니다.
        const userId = "testUser";
        const gameId = "defaultGame"; // 게임 ID
        const docRef = doc(db, `users/${userId}/gameState/${gameId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const savedState = docSnap.data() as GameState;
          // 저장된 상태를 사용하여 초기 상태를 업데이트
          dispatch({ type: "LOAD_GAME_STATE", payload: savedState });
        } else {
          console.log("No saved game state found, using initial state.");
          dispatch({ type: "LOAD_GAME_STATE", payload: initialState });
        }
      } catch (e) {
        console.error("Error loading game state:", e);
        setError("환생 정보를 불러오는 데 실패했습니다.");
        dispatch({ type: "LOAD_GAME_STATE", payload: initialState });
      } finally {
        setLoading(false);
      }
    };

    loadGameState();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // getJobTitle 함수 구현
  const fetchJobTitle = useCallback(async () => {
    const baseJob = JOBS[state.baseJob || "citizen"];
    const currentTitle = state.playerTitles.find((t: PlayerTitle) => t.id === state.currentTitleId); // `t`에 명시적 타입 지정

    if (!baseJob) {
      setJobTitle(state.baseJob || "Citizen"); // Fallback
      return;
    }

    let titleForCompose: Title;
    if (currentTitle) {
      titleForCompose = {
        id: currentTitle.id,
        label: currentTitle.name, // PlayerTitle의 'name'을 Title의 'label'로 매핑
        tags: currentTitle.tags,
        description: currentTitle.description,
        parentId: undefined,
        tier: 0,
        unlocked: true,
        path: "",
        baseXPToNextLevel: new Decimal(0),
        famePerSecBonus: new Decimal(0),
        level: 0,
        xp: new Decimal(0),
      };
    } else {
      // currentTitle이 없을 경우의 Fallback Title
      titleForCompose = {
        id: "",
        label: "", // Use label
        tags: [],
        description: "",
        parentId: undefined,
        tier: 0,
        unlocked: true,
        path: "",
        baseXPToNextLevel: new Decimal(0),
        famePerSecBonus: new Decimal(0),
        level: 0,
        xp: new Decimal(0),
      };
    }

    const composed = await composeJob(baseJob, titleForCompose);
    setJobTitle(composed.displayName);
  }, [state.baseJob, state.playerTitles, state.currentTitleId]); // 의존성 추가

  useEffect(() => {
    fetchJobTitle();
  }, [fetchJobTitle]); // fetchJobTitle이 변경될 때마다 실행

  if (loading) {
    return <div>Loading Game State...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

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

  // Actions Wrapper
  const onChoice = useCallback((choiceType: string) => {
    dispatch({ type: "CHOICE", choiceType });
  }, [dispatch]);

  const resetGameState = useCallback((nextJob?: string) => {
    dispatch({ type: "RESET_GAME", nextJob });
  }, [dispatch]);

  const actions = useMemo(() => ({
    analyzePlayerIntent: async (choiceId: string) => {
      const resolveSituation = httpsCallable(appFunctions, 'resolveSituation');
      try {
        // 첫 상황일 경우 firstSituationChoiceId를 저장
        if (state.currentChainLength === 0 && !state.firstSituationChoiceId) {
          if (["observe", "intervene", "distort"].includes(choiceId)) {
            dispatch({ type: "SET_FIRST_SITUATION_CHOICE", choiceId: choiceId as "observe" | "intervene" | "distort" });
          }
        }

        // choiceId를 intentText로 사용 (서버에서 실제 IntentType 매핑)
        await resolveSituation({ choiceId, intentText: choiceId });

        return { success: true };
      } catch (error) {
        console.error("Error resolving situation:", error);
        return { success: false, error };
      }
    },
    generateGameSituation: async () => {
      const createSituation = httpsCallable(appFunctions, 'createSituation');
      try {
        const result = await createSituation();
        // @ts-ignore
        return result.data as { situationText: string; options: string[] };
      } catch (error) {
        console.error("Error generating situation:", error);
        return undefined;
      }
    },
    unlockTitle: (id: string, tier: number) => {
      const cost = getTitleUnlockCost(tier);
      dispatch({ type: "UNLOCK_TITLE", id, cost });
    },
    upgradeTitle: (id: string, tier: number, currentLevel: number) => {
      const cost = getTitleUpgradeCost(tier, currentLevel);
      dispatch({ type: "UPGRADE_TITLE", id, cost });
    }
  }), [dispatch, state.fame, state.titles, state.currentChainLength, state.alignment, state.archetype, state.recentButterflyMarks, state.playerTitles, state.currentJobId, state.jobIntroducedAt, state.lastJobSuggestionDeclinedAt, state.currentSeason, state.expeditions, state.lastTick, state.feature, state.prestigePoints, state.firstSituationChoiceId]); // 의존성 추가

  // Tick
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      const delta = now - state.lastTick;
      dispatch({ type: "TICK", delta: Math.max(0, delta) }); // delta 음수 방지
    }, 100); // 50ms -> 100ms (최적화)
    return () => clearInterval(id);
  }, [state.lastTick, dispatch]); // dispatch 의존성 추가

  // Theme effect
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-evil", "theme-neutral", "theme-good");
    if (state.alignment <= -40) root.classList.add("theme-evil");
    else if (state.alignment >= 40) root.classList.add("theme-good");
    else root.classList.add("theme-neutral");
  }, [state.alignment]);

  return <Ctx.Provider value={{ state, dispatch, computed, actions, jobTitle, onChoice, resetGameState }}>{children}</Ctx.Provider>;
};

export const useGame = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useGame in Provider");
  return c;
};