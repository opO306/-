/**
 * 전직 선택 컴포넌트
 * 3가지 전직을 카드 형태로 표시
 */

import { JOBS } from '../../data/jobs';

interface JobSelectProps {
  onSelect: (jobId: string) => void;
}

export function JobSelect({ onSelect }: JobSelectProps) {
  const jobs = Object.values(JOBS);

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {jobs.map((job) => (
        <button
          key={job.id}
          onClick={() => onSelect(job.id)}
          className="w-full p-6 bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-blue-500 rounded-lg transition-all text-left"
        >
          <div className="flex items-start justify-between mb-2">
            <h3>{job.name}</h3>
            <JobIcon jobId={job.id} />
          </div>
          
          <p className="text-sm text-slate-400 mb-4">
            {job.description}
          </p>
          
          <div className="flex flex-col gap-1 text-xs text-slate-500">
            {job.bonuses.map((bonus, index) => (
              <div key={index} className="flex justify-between">
                <span>{bonus.label}</span>
                <span className="text-green-400">{bonus.value}</span>
              </div>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
}

function JobIcon({ jobId }: { jobId: string }) {
  const icons: Record<string, string> = {
    diligent: '🎯',
    restless: '⚡',
    observer: '👁️',
  };
  
  return (
    <span className="text-2xl">
      {icons[jobId] || '❓'}
    </span>
  );
}
