/**
 * 게임 루프 Hook
 * 일정 간격으로 XP를 자동 증가시킴
 */

import { useEffect, useRef } from 'react';
import { TICK_INTERVAL } from '../data/balance';

interface UseGameLoopProps {
  xpPerSecond: number;
  onTick: (xpGained: number) => void;
  enabled: boolean;
}

export function useGameLoop({ xpPerSecond, onTick, enabled }: UseGameLoopProps) {
  const intervalRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // 게임 루프 시작
    lastTickRef.current = Date.now();
    
    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - lastTickRef.current) / 1000; // 초 단위
      lastTickRef.current = now;
      
      // 초당 XP × 경과 시간
      const xpGained = xpPerSecond * deltaTime;
      onTick(xpGained);
    }, TICK_INTERVAL);

    // 클린업
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [xpPerSecond, onTick, enabled]);
}
