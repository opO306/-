import { IdentityCard } from "@/components/IdentityCard";
import { ActionCard }="@/components/ActionCard";
import { PrestigeProgress } from "@/components/PrestigeProgress";
import { SituationResult } from "@/components/SituationResult";
import { useGame } from "@/app/providers/GameProvider";
import { fmt } from "@/utils/number";
import { useEffect, useState } from "react";
import { generateArchetypeSummary } from "@/archetype/generateArchetypeSummary";
import { ArchetypeVector } from "@/types/archetype";
import { JOBS } from "@/data/jobs";

// 첫 탐험에서 직업 추천 로직 (임시)
function suggestInitialJob(ctx: { firstChoice: "observe" | "intervene" | "distort" }) {
  if (ctx.firstChoice === "observe") return "observer";
  if (ctx.firstChoice === "intervene") return "diligent";
  if (ctx.firstChoice === "distort") return "restless";
  return "observer"; // 기본값
}

function HeaderStats() {
  // 수정: 배열 비구조화 할당 -> 객체 비구조화 할당으로 변경
  const { state } = useGame();
  const { fame, famePerSec: fps, archetype } = state;

  const summary = generateArchetypeSummary(archetype);

  return (
    <section className="mb-8">
      <div className="text-4xl font-semibold tracking-tight">
        {fmt(fame)} <span className="text-base font-medium text-gray-400">{fmt(fps)}/s</span>
      </div>
      <div className="mt-1 text-sm text-gray-500">
        {summary}
      </div>
    </section>
  );
}

function IdentityCardCarousel() {
  return (
    <section className="mb-10 space-y-4">
      <IdentityCard
        title="황금빛 관찰자"
        description="금욕 성향이 강화되고 있음"
        bonuses={[
          { label: "연구 효율", value: "+15%" },
          { label: "환생 보너스", value: "+8%" },
        ]}
      />
      {/* 추후 swipe용 */}
    </section>
  );
}

function ActionSection() {
  // TODO: ActionCard 클릭 시 상황 발생 로직 추가
  return (
    <section className="mb-10 grid grid-cols-2 gap-4">
      <ActionCard
        title="연구하기"
        description="다음 성향 변화: 질서 ↑"
      />
      <ActionCard
        title="탐험 보내기"
        description="위험도 ★★★"
      />
    </section>
  );
}

function BottomNav() {
  const [currentTab, setCurrentTab] = useState("홈");

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="mx-auto flex max-w-md justify-around py-3 text-sm">
        <span className={currentTab === "홈" ? "font-medium text-black" : "text-gray-400"} onClick={() => setCurrentTab("홈")}>홈</span>
        <span className={currentTab === "업적" ? "font-medium text-black" : "text-gray-400"} onClick={() => setCurrentTab("업적")}>업적</span>
        <span className={currentTab === "나" ? "font-medium text-black" : "text-gray-400"} onClick={() => setCurrentTab("나")}>나</span>
      </div>
    </nav>
  );
}

export default function HomeScreen() {
  // 수정: 배열 비구조화 할당 -> 객체 비구조화 할당으로 변경
  const { state, dispatch } = useGame();
  const { currentChainLength, currentJobId } = state;
  const [showJobSuggestion, setShowJobSuggestion] = useState(false);
  const [suggestedJobId, setSuggestedJobId] = useState<string | undefined>(undefined);
  const [currentSituationText, setCurrentSituationText] = useState<string | undefined>(undefined);
  const [currentSituationOnContinue, setCurrentSituationOnContinue] = useState<(() => void) | undefined>(undefined);

  useEffect(() => {
    // TODO: 첫 탐험 후 직업 제안 로직
    // 임시로 currentChainLength가 1일 때 직업 제안이 뜨도록 설정
    if (currentChainLength === 1 && !currentJobId && !showJobSuggestion) {
      const firstChoice: "observe" | "intervene" | "distort" = "observe"; // 임시값
      const suggested = suggestInitialJob({ firstChoice });
      setSuggestedJobId(suggested);
      setCurrentSituationText(
        `세계는 당신의 태도를 [ ${JOBS[suggested].name} ]의 관점으로 인식하기 시작합니다.`
      );
      setCurrentSituationOnContinue(undefined);
      setShowJobSuggestion(true);
    }
  }, [currentChainLength, currentJobId, showJobSuggestion]);

  // 직업 제안 UI 렌더링
  if (showJobSuggestion && currentSituationText && suggestedJobId) {
    return (
      <SituationResult
        text={currentSituationText}
        showJobSuggestionButtons={true}
        suggestedJobName={JOBS[suggestedJobId]?.name}
        onAcceptJob={() => {
          dispatch({ type: "SET_CURRENT_JOB", jobId: suggestedJobId, introducedAt: Date.now() });
          setShowJobSuggestion(false);
          setSuggestedJobId(undefined);
          setCurrentSituationText(undefined);
        }}
        onDeclineJob={() => {
          setShowJobSuggestion(false);
          setSuggestedJobId(undefined);
          setCurrentSituationText(undefined);
        }}
        onContinue={currentSituationOnContinue || (() => {})}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-5 pt-6 pb-24">
      <HeaderStats />
      <IdentityCardCarousel />
      <ActionSection />
      <PrestigeProgress />
      <BottomNav />
    </main>
  );
}
