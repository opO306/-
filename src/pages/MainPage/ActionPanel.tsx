/**
 * 액션 패널
 * 하단 업그레이드 버튼 영역
 */

import { useGame } from '../../app/providers/GameProvider';

export function ActionPanel() {
  const { state, computed, upgradeAPS, upgradeXP } = useGame();
  
  const canUpgradeAPS = state.currentXP >= computed.apsUpgradeCost;
  const canUpgradeXP = state.currentXP >= computed.xpUpgradeCost;

  return (
    <div className="w-full bg-slate-800 border-t border-slate-700 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-3">
          {/* APS 업그레이드 */}
          <button
            onClick={upgradeAPS}
            disabled={!canUpgradeAPS}
            className={`
              p-4 rounded-lg border-2 transition-all
              ${canUpgradeAPS 
                ? 'bg-blue-600 hover:bg-blue-500 border-blue-500 cursor-pointer' 
                : 'bg-slate-700 border-slate-600 opacity-50 cursor-not-allowed'
              }
            `}
          >
            <div className="text-sm text-slate-300 mb-1">APS 업그레이드</div>
            <div className="text-xs text-slate-400">
              Lv.{state.upgrades.apsUpgrade} → Lv.{state.upgrades.apsUpgrade + 1}
            </div>
            <div className="text-lg font-bold mt-2">
              {formatNumber(computed.apsUpgradeCost)} XP
            </div>
          </button>
          
          {/* XP 업그레이드 */}
          <button
            onClick={upgradeXP}
            disabled={!canUpgradeXP}
            className={`
              p-4 rounded-lg border-2 transition-all
              ${canUpgradeXP 
                ? 'bg-green-600 hover:bg-green-500 border-green-500 cursor-pointer' 
                : 'bg-slate-700 border-slate-600 opacity-50 cursor-not-allowed'
              }
            `}
          >
            <div className="text-sm text-slate-300 mb-1">XP 업그레이드</div>
            <div className="text-xs text-slate-400">
              Lv.{state.upgrades.xpUpgrade} → Lv.{state.upgrades.xpUpgrade + 1}
            </div>
            <div className="text-lg font-bold mt-2">
              {formatNumber(computed.xpUpgradeCost)} XP
            </div>
          </button>
        </div>
        
        {/* 칭호 관리 버튼 (추후 구현) */}
        <button
          className="w-full mt-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm"
        >
          칭호 관리
        </button>
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return Math.floor(num).toString();
}