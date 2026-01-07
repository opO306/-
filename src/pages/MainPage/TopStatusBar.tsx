/**
 * 상단 상태 바
 * 전직 정보 + XP 진행 상황
 */

import { useGame } from '../../app/providers/GameProvider';
import { JOBS } from '../../data/jobs';

export function TopStatusBar() {
  const { state, computed } = useGame();
  
  const job = state.job ? JOBS[state.job] : null;
  const xpProgress = (state.currentXP / computed.xpForNextLevel) * 100;

  if (!job) return null;

  return (
    <div className="w-full bg-slate-800 border-b border-slate-700 p-4">
      <div className="max-w-2xl mx-auto">
        {/* 전직 정보 */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">{getJobIcon(state.job)}</span>
          <span className="text-sm text-slate-400">{job.name}</span>
        </div>
        
        {/* XP 진행 바 */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>XP</span>
            <span>
              {formatNumber(state.currentXP)} / {formatNumber(computed.xpForNextLevel)}
            </span>
          </div>
          
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${Math.min(xpProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function getJobIcon(jobId: string | null): string {
  const icons: Record<string, string> = {
    diligent: '🎯',
    restless: '⚡',
    observer: '👁️',
  };
  return jobId ? icons[jobId] || '❓' : '❓';
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