/**
 * AI Status Indicator - AI 상태 표시 컴포넌트
 * AI 사용 가능 여부와 fallback 상태를 표시
 */
import { useState } from "react";

interface AIStatusIndicatorProps {
  aiEnabled: boolean;
  usingFallback: boolean;
}

export function AIStatusIndicator({ aiEnabled, usingFallback }: AIStatusIndicatorProps) {
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className={`fixed top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg transition-all z-50 ${
          aiEnabled && !usingFallback
            ? "bg-green-500 text-white"
            : usingFallback
            ? "bg-yellow-500 text-white"
            : "bg-gray-500 text-white"
        }`}
      >
        {aiEnabled && !usingFallback ? "🤖 AI 활성" : usingFallback ? "📚 Fallback" : "🤖 AI 비활성"}
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-white rounded-xl shadow-xl p-4 max-w-xs z-50 border border-gray-200 animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-800">AI 상태</h3>
        <button
          onClick={() => setExpanded(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 text-sm">
        {aiEnabled && !usingFallback && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700 font-medium">AI 완전 활성</span>
            </div>
            <p className="text-gray-600 text-xs">
              AI가 상황과 설명을 동적으로 생성하여 더욱 풍부한 경험을 제공합니다.
            </p>
          </>
        )}

        {usingFallback && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-yellow-700 font-medium">Fallback 모드</span>
            </div>
            <p className="text-gray-600 text-xs">
              AI가 일시적으로 사용 불가능하여 사전 준비된 콘텐츠를 사용합니다.
              게임 플레이는 정상적으로 진행됩니다.
            </p>
          </>
        )}

        {!aiEnabled && !usingFallback && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full" />
              <span className="text-gray-700 font-medium">AI 비활성</span>
            </div>
            <p className="text-gray-600 text-xs">
              AI 없이 사전 준비된 콘텐츠로 게임을 플레이합니다.
              핵심 경험은 동일하게 유지됩니다.
            </p>
          </>
        )}

        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            💡 <strong>중요:</strong> AI가 없어도 게임의 모든 기능은 정상 작동합니다.
            AI는 경험을 향상시킬 뿐, 필수 요소가 아닙니다.
          </p>
        </div>
      </div>
    </div>
  );
}
