/**
 * Achievement Screen - 업적 화면
 * 칭호 기반으로 자동 생성된 업적을 표시합니다.
 */
import { useState, useMemo } from "react";
import { useGame } from "@/app/providers/GameProvider";
import { TITLE_NODES } from "@/data/titles";

interface Achievement {
  id: string;
  titleId: string;
  name: string;
  description: string;
  condition: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

// 칭호 태그 기반 업적 자동 생성
function generateAchievementsFromTitles(state: any): Achievement[] {
  const achievements: Achievement[] = [];
  
  TITLE_NODES.forEach((title) => {
    // 각 칭호에 대해 해금 업적 생성
    const titleState = state.titles[title.id];
    const isUnlocked = titleState && titleState.level >= 0;
    
    achievements.push({
      id: `unlock_${title.id}`,
      titleId: title.id,
      name: `${title.label} 해금`,
      description: `"${title.label}" 칭호를 해금하세요`,
      condition: "unlock",
      unlocked: isUnlocked,
      progress: isUnlocked ? 1 : 0,
      maxProgress: 1,
    });
    
    // 레벨업 업적 (레벨 5 달성)
    if (isUnlocked) {
      const level = titleState.level;
      achievements.push({
        id: `level5_${title.id}`,
        titleId: title.id,
        name: `${title.label} 마스터`,
        description: `"${title.label}" 칭호를 레벨 5로 강화하세요`,
        condition: "level_5",
        unlocked: level >= 5,
        progress: Math.min(level, 5),
        maxProgress: 5,
      });
    }
  });
  
  return achievements;
}

export default function AchievementScreen({ onBack }: { onBack: () => void }) {
  const { state } = useGame();
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");
  
  const achievements = useMemo(() => {
    return generateAchievementsFromTitles(state);
  }, [state.titles]);
  
  const filteredAchievements = useMemo(() => {
    if (filter === "unlocked") {
      return achievements.filter(a => a.unlocked);
    } else if (filter === "locked") {
      return achievements.filter(a => !a.unlocked);
    }
    return achievements;
  }, [achievements, filter]);
  
  const stats = useMemo(() => {
    const total = achievements.length;
    const unlocked = achievements.filter(a => a.unlocked).length;
    return { total, unlocked, percentage: Math.floor((unlocked / total) * 100) };
  }, [achievements]);

  return (
    <main className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-5 py-4">
          <div className="flex items-center mb-3">
            <button onClick={onBack} className="mr-3 text-gray-600">
              ←
            </button>
            <h1 className="text-xl font-semibold">업적</h1>
          </div>
          
          {/* 통계 */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">달성률</span>
              <span className="text-lg font-bold text-purple-600">
                {stats.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 text-right">
              {stats.unlocked} / {stats.total} 달성
            </div>
          </div>
        </div>
        
        {/* 필터 */}
        <div className="flex border-t px-5">
          {(["all", "unlocked", "locked"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-3 text-sm transition-colors ${
                filter === f
                  ? "text-purple-600 border-b-2 border-purple-600 font-medium"
                  : "text-gray-500"
              }`}
            >
              {f === "all" ? "전체" : f === "unlocked" ? "달성" : "미달성"}
            </button>
          ))}
        </div>
      </div>

      {/* 업적 목록 */}
      <div className="px-5 pt-4 space-y-3">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${
              achievement.unlocked
                ? "border-purple-200 bg-gradient-to-br from-white to-purple-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className={`font-medium mb-1 ${
                  achievement.unlocked ? "text-purple-700" : "text-gray-700"
                }`}>
                  {achievement.unlocked && "✓ "}{achievement.name}
                </h3>
                <p className="text-sm text-gray-500">{achievement.description}</p>
              </div>
              {achievement.unlocked && (
                <div className="ml-2 text-2xl">🏆</div>
              )}
            </div>
            
            {!achievement.unlocked && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>진행도</span>
                  <span>{achievement.progress} / {achievement.maxProgress}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-blue-400 h-1.5 rounded-full transition-all"
                    style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
        
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">📋</div>
            <p>표시할 업적이 없습니다</p>
          </div>
        )}
      </div>
    </main>
  );
}
