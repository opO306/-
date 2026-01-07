/**
 * 성장 패널
 * 중앙에 큰 숫자로 현재 상태 표시
 */

import { useGame } from '../../app/providers/GameProvider';

export function GrowthPanel() {
  const { state, computed } = useGame();

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      {/* 현재 레벨 */}
      <div className="text-center">
        <div className="text-sm text-slate-500 mb-1">레벨</div>
        <div className="text-6xl font-bold text-white">
          {state.level}
        </div>
      </div>
      
      {/* 성장 수치 */}
      <div className="flex gap-12">
        <StatItem
          label="APS"
          value={computed.currentAPS.toFixed(1)}
          description="초당 행동"
        />
        <StatItem
          label="XP/s"
          value={formatNumber(computed.xpPerSecond)}
          description="초당 경험치"
          highlight
        />
      </div>
      
      {/* 보조 정보 */}
      <div className="text-xs text-slate-500 space-y-1 text-center">
        <div>총 행동 횟수: {formatNumber(state.totalActions)}</div>
        <div>플레이 시간: {formatTime(state.playTime)}</div>
      </div>
    </div>
  );
}

interface StatItemProps {
  label: string;
  value: string;
  description: string;
  highlight?: boolean;
}

function StatItem({ label, value, description, highlight }: StatItemProps) {
  return (
    <div className="text-center">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className={`text-3xl font-bold ${highlight ? 'text-green-400' : 'text-slate-300'}`}>
        {value}
      </div>
      <div className="text-xs text-slate-600 mt-1">{description}</div>
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
  return num.toFixed(1);
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  }
  return `${minutes}분`;
}