/**
 * src/pages/MainPage/TopStatusBar.tsx
 */
import { useGame } from '../../app/providers/GameProvider';

export function TopStatusBar() {
  const { state } = useGame();
  
  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 p-2 px-4 shadow-sm">
      <div className="max-w-2xl mx-auto flex justify-between items-center">
        {/* 좌측: 시즌 정보 */}
        <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-400 border border-slate-700">
                Season {state.currentSeason}
            </span>
        </div>

        {/* 우측: 시간/틱 정보 (디버그용 혹은 정보용) */}
        <div className="text-xs text-slate-500">
            Tick: {state.lastTick % 10000}
        </div>
      </div>
    </div>
  );
}
