/**
 * 게임 시작 화면 - 전직 선택
 * 1회만 접근 가능, 선택 후 되돌릴 수 없음
 */

import { useState } from 'react';
import { useGame } from '../../app/providers/GameProvider';
import { JobSelect } from './JobSelect';

export function StartPage({ onComplete }: { onComplete: () => void }) {
  const { state, selectJob } = useGame();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // 이미 전직을 선택했다면 이 화면을 보면 안 됨
  if (state.job !== null) {
    onComplete();
    return null;
  }

  const handleJobClick = (jobId: string) => {
    setSelectedJobId(jobId);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (selectedJobId) {
      selectJob(selectedJobId as any);
      onComplete();
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setSelectedJobId(null);
  };

  return (
    <div className="size-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      {!showConfirm ? (
        <>
          <h1 className="mb-2">칭호 키우기</h1>
          <p className="text-slate-400 mb-12">당신의 길을 선택하세요</p>
          
          <JobSelect onSelect={handleJobClick} />
          
          <p className="text-sm text-slate-500 mt-8">
            ⚠️ 전직은 선택 후 변경할 수 없습니다
          </p>
        </>
      ) : (
        <div className="max-w-md w-full bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="mb-4">정말 선택하시겠습니까?</h2>
          <p className="text-slate-400 mb-6">
            이 선택은 되돌릴 수 없습니다.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
