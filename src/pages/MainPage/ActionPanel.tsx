/**
 * src/pages/MainPage/ActionPanel.tsx
 * 액션 패널: 칭호 관리 (해금/강화)
 */
import { useGame, getTitleUnlockCost, getTitleUpgradeCost } from '../../app/providers/GameProvider';
import { TITLE_NODES } from '../../data/titles';
import { useMemo } from 'react';

export function ActionPanel() {
  const { state, actions } = useGame();

  // 표시할 타이틀 목록: 이미 해금되었거나, 해금 가능한(부모가 해금된) 타이틀
  const visibleTitles = useMemo(() => {
    return TITLE_NODES.filter(node => {
      const isUnlocked = state.titles[node.id].level >= 0;
      if (isUnlocked) return true;
      // 부모 확인
      if (!node.parentId) return true; // 루트
      return state.titles[node.parentId].level >= 0;
    }).sort((a, b) => a.tier - b.tier); // 티어 낮은 순 정렬
  }, [state.titles]);

  return (
    <div className="w-full bg-slate-800 border-t border-slate-700 p-4 h-[300px] overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-3">
        <h3 className="text-sm font-bold text-slate-400 mb-2">칭호 관리</h3>
        
        {visibleTitles.map(node => {
            const titleState = state.titles[node.id];
            const isUnlocked = titleState.level >= 0;
            const currentLevel = isUnlocked ? titleState.level : 0;
            
            // 비용 계산
            const cost = isUnlocked 
                ? getTitleUpgradeCost(node.tier, currentLevel)
                : getTitleUnlockCost(node.tier);

            const canAfford = state.fame.gte(cost);

            return (
                <div key={node.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-200">
                            {node.label} <span className="text-xs text-slate-500">Tier {node.tier}</span>
                        </span>
                        <span className="text-xs text-slate-400">{node.description || "설명 없음"}</span>
                        {isUnlocked && (
                            <span className="text-xs text-blue-400 mt-1">Lv.{currentLevel} (보너스: +{node.famePerSecBonus.toString()}/s)</span>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            if (isUnlocked) {
                                actions.upgradeTitle(node.id, node.tier, currentLevel);
                            } else {
                                actions.unlockTitle(node.id, node.tier);
                            }
                        }}
                        disabled={!canAfford}
                        className={`
                            px-4 py-2 rounded text-sm font-bold transition-colors
                            ${canAfford 
                                ? (isUnlocked ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white')
                                : 'bg-slate-600 text-slate-400 cursor-not-allowed opacity-50'
                            }
                        `}
                    >
                        {isUnlocked ? "강화" : "해금"}
                        <div className="text-xs font-normal opacity-80">
                            {formatNumber(cost)} Fame
                        </div>
                    </button>
                </div>
            );
        })}

        {visibleTitles.length === 0 && (
            <div className="text-center text-slate-500 py-8">
                가능한 행동이 없습니다.
            </div>
        )}
      </div>
    </div>
  );
}

function formatNumber(num: any): string {
  const d = num;
  if (d.gte(1000000)) return d.toExponential(1);
  if (d.gte(1000)) return d.toFixed(0);
  return d.toFixed(0);
}
