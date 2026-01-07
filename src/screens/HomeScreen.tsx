import { IdentityCard } from "@/components/IdentityCard";
import { ActionCard } from "@/components/ActionCard";
import { PrestigeProgress } from "@/components/PrestigeProgress";
import { SituationResult } from "@/components/SituationResult"; // SituationResult 임포트
import { useGame } from "@/app/providers/GameProvider";
import { fmt } from "@/utils/number";
import { useEffect, useState } from "react"; // useEffect 추가
import { generateArchetypeSummary } from "@/archetype/generateArchetypeSummary";
import { ArchetypeVector } from "@/types/archetype";
import { JOBS } from "@/data/jobs"; // JOBS 임포트

// 첫 탐험에서 직업 추천 로직 (임시)
function suggestInitialJob(ctx: { firstChoice: "observe" | "intervene" | "distort" }) {
  if (ctx.firstChoice === "observe") return "observer";
  if (ctx.firstChoice === "intervene") return "diligent";
  if (ctx.firstChoice === "distort") return "restless"; // TODO: trickster 직업 정의 필요
  return "observer"; // 기본값
}

function HeaderStats() {
  const [state] = useGame();
  const { fame, famePerSec: fps, archetype } = state; // archetype 가져오기

  const summary = generateArchetypeSummary(archetype);

  return (
    <section className="mb-8">
      <div className="text-4xl font-semibold tracking-tight">
        {fmt(fame)} <span className="text-base font-medium text-gray-400">/s</span>
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
  const [state, dispatch] = useGame();
  const { currentChainLength, currentJobId } = state;
  const [showJobSuggestion, setShowJobSuggestion] = useState(false);
  const [suggestedJobId, setSuggestedJobId] = useState<string | undefined>(undefined);
  const [currentSituationText, setCurrentSituationText] = useState<string | undefined>(undefined); // 상황 텍스트 상태 추가
  const [currentSituationOnContinue, setCurrentSituationOnContinue] = useState<(() => void) | undefined>(undefined); // 상황 계속하기 핸들러 추가

  useEffect(() => {
    // TODO: 첫 탐험 후 직업 제안 로직
    // 임시로 currentChainLength가 1일 때 직업 제안이 뜨도록 설정
    if (currentChainLength === 1 && !currentJobId && !showJobSuggestion) {
      // TODO: 첫 상황의 choiceId를 가져오는 로직 필요
      const firstChoice: "observe" | "intervene" | "distort" = "observe"; // 임시값
      const suggested = suggestInitialJob({ firstChoice });
      setSuggestedJobId(suggested);
      setCurrentSituationText(
        `세계는 당신의 태도를 [ ${JOBS[suggested].name} ]의 관점으로 인식하기 시작합니다.`
      );
      setCurrentSituationOnContinue(undefined); // 직업 제안 버튼 사용 시 onContinue는 사용하지 않으므로 undefined
      setShowJobSuggestion(true); // 직업 제안 버튼을 바로 띄우도록 설정
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
          setSuggestedJobId(undefined); // 직업 제안 완료 후 초기화
          setCurrentSituationText(undefined);
        }}
        onDeclineJob={() => {
          setShowJobSuggestion(false);
          setSuggestedJobId(undefined); // 직업 제안 거절 후 초기화
          setCurrentSituationText(undefined);
          // TODO: 보류 시 재제안 쿨타임 로직 추가 (X5 항목)
        }}
        onContinue={() => {}} // 기본 onContinue는 사용하지 않으므로 빈 함수 전달
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