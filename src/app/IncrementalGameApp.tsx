import React, { useEffect, useReducer, ReactNode } from "react";
import Decimal from "break_infinity.js";
import { TITLE_NODES } from "../data/titles";
import { EXPEDITIONS } from "../data/expeditions"; // EXPEDITIONS 임포트
import { GameProvider } from "@/app/providers/GameProvider";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────
export type GameState = {
  fame: Decimal;
  famePerSec: Decimal;
  upgrades: number[];            // 연구 레벨 (시스템용)
  titles: Record<string, number>; // titleId -> 강화 레벨(-1 = 잠금)
  lastTick: number;
  currentTitle: string; // 현재 칭호
  currentJob: string;   // 현재 직업
  alignment: number;    // 성향 (-100 ~ 100)
  dialogOpen: boolean; // 다이얼로그 열림 여부
  dialogContent: string; // 다이얼로그 내용 (어떤 다이얼로그인지 식별)
  currentExpeditionId: string | null; // 현재 진행 중인 탐험 ID
  expeditionFinishTime: number | null; // 탐험 완료 시간 (타임스탬프)
  completedExpeditions: Record<string, number>; // 완료된 탐험 횟수
};

type Action =
  | { type: "TICK"; delta: number }
  | { type: "BUY_UPGRADE"; index: number }
  | { type: "UNLOCK_TITLE"; id: string }
  | { type: "UPGRADE_TITLE"; id: string }
  | { type: "OPEN_DIALOG"; id: string }
  | { type: "CLOSE_DIALOG" }
  | { type: "LOAD_GAME"; payload: GameState }
  | { type: "START_EXPEDITION"; expeditionId: string } // 탐험 시작
  | { type: "FINISH_EXPEDITION"; expeditionId: string }; // 탐험 완료

// ────────────────────────────────────────────────────────────
// Initial State
// ────────────────────────────────────────────────────────────
const initialState: GameState = {
  fame: new Decimal(0),
  famePerSec: new Decimal(1),
  upgrades: [0, 0, 0],
  titles: TITLE_NODES.reduce<Record<string, number>>((acc, n) => {
    acc[n.id] = n.id === "citizen" ? 0 : -1; // 0 = 해금, -1 = 잠금
    return acc;
  }, {}),
  lastTick: Date.now(),
  currentTitle: "Citizen",
  currentJob: "Citizen",
  alignment: 0,
  dialogOpen: false,
  dialogContent: "",
  currentExpeditionId: null,
  expeditionFinishTime: null,
  completedExpeditions: {},
};

// ────────────────────────────────────────────────────────────
// Helper Functions
// ────────────────────────────────────────────────────────────
function researchCost(index: number, level: number): Decimal {
  const base = [10, 100, 1000][index];
  return new Decimal(base).mul(Decimal.pow(1.15, level));
}

export function titleUnlockCost(tier: number): Decimal {
  // 간단 공식: 100 × tier^3 Fame
  return new Decimal(100 * Math.pow(tier, 3));
}

export function titleUpgradeCost(level: number): Decimal {
  // 강화 비용: 1,000 × 1.2^level Fame
  return new Decimal(1000).mul(Decimal.pow(1.2, level));
}

// ────────────────────────────────────────────────────────────
// Reducer
// ────────────────────────────────────────────────────────────
function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "TICK": {
      const gained = state.famePerSec.mul(action.delta / 1000);
      // 탐험이 진행 중이고 완료 시간이 되면 FINISH_EXPEDITION 액션 디스패치
      if (state.currentExpeditionId && state.expeditionFinishTime && Date.now() >= state.expeditionFinishTime) {
        return gameReducer(state, { type: "FINISH_EXPEDITION", expeditionId: state.currentExpeditionId });
      }
      return { ...state, fame: state.fame.plus(gained), lastTick: Date.now() };
    }

    case "BUY_UPGRADE": {
      const cost = researchCost(action.index, state.upgrades[action.index]);
      if (state.fame.lt(cost)) return state;
      const upgrades = [...state.upgrades];
      upgrades[action.index] += 1;
      const famePerSec = state.famePerSec.mul(1.5);
      return { ...state, fame: state.fame.minus(cost), famePerSec, upgrades };
    }

    case "UNLOCK_TITLE": {
      const node = TITLE_NODES.find((n) => n.id === action.id);
      if (!node) return state;
      if (state.titles[action.id] >= 0) return state; // already unlocked
      const cost = titleUnlockCost(node.tier);
      if (state.fame.lt(cost)) return state;
      return {
        ...state,
        fame: state.fame.minus(cost),
        titles: { ...state.titles, [action.id]: 0 },
      };
    }

    case "UPGRADE_TITLE": {
      const level = state.titles[action.id];
      if (level < 0) return state; // 잠금 상태
      const cost = titleUpgradeCost(level);
      if (state.fame.lt(cost)) return state;
      return {
        ...state,
        fame: state.fame.minus(cost),
        titles: { ...state.titles, [action.id]: level + 1 },
      };
    }

    case "OPEN_DIALOG": {
        return { ...state, dialogOpen: true, dialogContent: action.id };
    }
    case "CLOSE_DIALOG": {
        return { ...state, dialogOpen: false, dialogContent: "" };
    }
    case "LOAD_GAME": {
        // 기존 상태에 저장된 상태를 병합하여 불변성 유지
        return {
            ...state,
            fame: action.payload.fame,
            famePerSec: action.payload.famePerSec,
            upgrades: action.payload.upgrades,
            titles: action.payload.titles,
            lastTick: action.payload.lastTick,
            currentTitle: action.payload.currentTitle,
            currentJob: action.payload.currentJob,
            alignment: action.payload.alignment,
            dialogOpen: action.payload.dialogOpen,
            dialogContent: action.payload.dialogContent,
            currentExpeditionId: action.payload.currentExpeditionId,
            expeditionFinishTime: action.payload.expeditionFinishTime,
            completedExpeditions: action.payload.completedExpeditions,
        };
    }
    case "START_EXPEDITION": {
        const { expeditionId } = action;
        const expedition = EXPEDITIONS.find(exp => exp.id === expeditionId);
        if (!expedition) return state;
        // TODO: Fame 소모, 필요 직업 등 조건 확인
        const newFame = state.fame.minus(expedition.fameCost);
        if (newFame.lt(0)) return state; // Fame 부족

        const finishTime = Date.now() + expedition.time * 60 * 1000; // 분 -> 밀리초

        return {
            ...state,
            fame: newFame,
            currentExpeditionId: expeditionId,
            expeditionFinishTime: finishTime,
            dialogOpen: false, // 탐험 시작 시 다이얼로그 닫기
            dialogContent: "",
        };
    }
    case "FINISH_EXPEDITION": {
        const { expeditionId } = action;
        if (state.currentExpeditionId !== expeditionId || !state.expeditionFinishTime || Date.now() < state.expeditionFinishTime) {
            return state; // 진행 중인 탐험이 아니거나 아직 완료되지 않음
        }
        const expedition = EXPEDITIONS.find(exp => exp.id === expeditionId);
        if (!expedition) return state;

        // 보상 계산 (Fame 보상은 비율로 주어지므로 현재 Fame에 비례)
        const fameRewardAmount = state.fame.mul(expedition.fameReward);
        const newFame = state.fame.plus(fameRewardAmount);
        const newAlignment = Math.max(-100, Math.min(100, state.alignment + expedition.alignmentDelta));

        return {
            ...state,
            fame: newFame,
            alignment: newAlignment,
            currentExpeditionId: null,
            expeditionFinishTime: null,
            completedExpeditions: {
                ...state.completedExpeditions,
                [expeditionId]: (state.completedExpeditions[expeditionId] || 0) + 1,
            },
        };
    }

    default:
      return state;
  }
}

// Root component (IncrementalGameApp) - children 렌더링하도록 수정
// ────────────────────────────────────────────────────────────
export default function IncrementalGameApp({ children }: { children?: ReactNode }) {
  return (
    <GameProvider>
      {children}
    </GameProvider>
  );
}