/**
 * Onboarding Screen - 온보딩 화면
 * 게임의 핵심 철학과 차별점을 명확히 전달
 */
import { useState } from "react";

interface OnboardingScreenProps {
  onComplete: () => void;
}

const philosophySlides = [
  {
    title: "능력치가 없는 세계",
    subtitle: "성장이 아닌, 변화의 이야기",
    icon: "🎭",
    description: [
      "이 세계에는 레벨이나 스탯이 없습니다.",
      "당신의 선택은 수치가 아닌 '칭호'로 기록됩니다.",
      "더 강해지는 것이 아니라, 다른 존재가 되어갑니다.",
    ],
    color: "from-purple-500 to-blue-500",
  },
  {
    title: "정답이 없는 선택",
    subtitle: "모든 길은 다른 이야기를 만듭니다",
    icon: "🌿",
    description: [
      "옳고 그른 선택은 없습니다.",
      "각 선택은 다른 칭호로 이어지고,",
      "그것은 단지 '다른' 플레이일 뿐입니다.",
    ],
    color: "from-green-500 to-teal-500",
  },
  {
    title: "반복되는 환생",
    subtitle: "끝은 새로운 시작입니다",
    icon: "♾️",
    description: [
      "한 번의 플레이로 모든 것을 볼 수 없습니다.",
      "환생을 통해 새로운 칭호와 이야기를 발견하세요.",
      "매번 다른 정체성으로 세계를 경험합니다.",
    ],
    color: "from-orange-500 to-red-500",
  },
  {
    title: "칭호 합성",
    subtitle: "당신만의 정체성 창조",
    icon: "⚗️",
    description: [
      "여러 칭호를 합성하여 새로운 칭호를 만들 수 있습니다.",
      "예상치 못한 조합이 독특한 결과를 낳습니다.",
      "직접 칭호를 제안하고 게임에 기여할 수도 있습니다.",
    ],
    color: "from-pink-500 to-purple-500",
  },
  {
    title: "AI가 없어도 괜찮아요",
    subtitle: "게임은 항상 작동합니다",
    icon: "🎲",
    description: [
      "AI는 이야기를 더 풍부하게 만들지만 필수는 아닙니다.",
      "AI가 없어도 사전 준비된 콘텐츠로 플레이 가능합니다.",
      "당신의 경험은 언제나 보장됩니다.",
    ],
    color: "from-blue-500 to-cyan-500",
  },
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < philosophySlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = philosophySlides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl" />
      </div>

      {/* Skip 버튼 */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors text-sm z-10"
      >
        건너뛰기 →
      </button>

      {/* 진행 표시 */}
      <div className="flex gap-2 mb-8">
        {philosophySlides.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all ${
              index === currentSlide
                ? "w-8 bg-white"
                : index < currentSlide
                ? "w-4 bg-gray-400"
                : "w-4 bg-gray-600"
            }`}
          />
        ))}
      </div>

      {/* 슬라이드 콘텐츠 */}
      <div className="max-w-md w-full space-y-6 text-center relative z-10 animate-fade-in">
        {/* 아이콘 */}
        <div className={`inline-block text-8xl mb-4 animate-bounce-slow`}>
          {slide.icon}
        </div>

        {/* 제목 */}
        <div>
          <h1
            className={`text-3xl font-bold mb-2 bg-gradient-to-r ${slide.color} bg-clip-text text-transparent`}
          >
            {slide.title}
          </h1>
          <p className="text-gray-300 text-sm">{slide.subtitle}</p>
        </div>

        {/* 설명 */}
        <div className="space-y-3 text-left bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          {slide.description.map((line, index) => (
            <div
              key={index}
              className="flex items-start gap-3 animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`w-2 h-2 rounded-full bg-gradient-to-r ${slide.color} mt-2 flex-shrink-0`}
              />
              <p className="text-gray-200 leading-relaxed">{line}</p>
            </div>
          ))}
        </div>

        {/* 특별 강조 (첫 슬라이드) */}
        {currentSlide === 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 animate-pulse-slow">
            <p className="text-yellow-200 text-sm">
              ⚡ <strong>이 게임은 다릅니다.</strong> 전통적인 성장 시스템이 없으며,
              당신의 선택이 곧 정체성이 됩니다.
            </p>
          </div>
        )}
      </div>

      {/* 버튼 */}
      <div className="mt-8 flex gap-4">
        {currentSlide > 0 && (
          <button
            onClick={() => setCurrentSlide(currentSlide - 1)}
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 transition-all"
          >
            이전
          </button>
        )}
        <button
          onClick={handleNext}
          className={`px-8 py-3 rounded-full font-semibold text-white transition-all shadow-lg hover:shadow-xl bg-gradient-to-r ${slide.color}`}
        >
          {currentSlide === philosophySlides.length - 1 ? "시작하기" : "다음"}
        </button>
      </div>

      {/* 페이지 번호 */}
      <div className="mt-4 text-gray-500 text-sm">
        {currentSlide + 1} / {philosophySlides.length}
      </div>
    </div>
  );
}
