/**
 * 메인 성장 화면
 * 게임의 90%가 머무는 화면
 */

import { TopStatusBar } from './TopStatusBar';
import { GrowthPanel } from './GrowthPanel';
import { ActionPanel } from './ActionPanel';

export function MainPage() {
  return (
    <div className="size-full flex flex-col bg-slate-900">
      {/* 상단 고정: 전직 + XP 바 */}
      <TopStatusBar />
      
      {/* 메인 성장 영역: 중앙 수치 표시 */}
      <div className="flex-1 flex items-center justify-center">
        <GrowthPanel />
      </div>
      
      {/* 하단 액션 영역: 버튼들 */}
      <ActionPanel />
    </div>
  );
}
