import { IdentityCard } from "@/components/IdentityCard";
import { ActionCard } from "@/components/ActionCard";
import { PrestigeProgress } from "@/components/PrestigeProgress";
import { SituationResult } from "@/components/SituationResult"; // SituationResult 임포트
import { AIStatusIndicator } from "@/components/AIStatusIndicator";
import { useGame } from "@/app/providers/GameProvider";
import { fmt } from "@/utils/number";
import { useEffect, useState } from "react"; // useEffect 추가
import { generateArchetypeSummary } from "@/archetype/generateArchetypeSummary";
import { ArchetypeVector } from "@/types/archetype";
import { JOBS } from "@/data/jobs"; // JOBS 임포트
import TitleCodexScreen from "./TitleCodexScreen";

// 첫 탐험에서 직업 추천 로직 (임시)
function suggestInitialJob(ctx: { firstChoice: "observe" | "intervene" | "distort" }) {
  if (ctx.firstChoice === "observe") return "observer";
  if (ctx.firstChoice === "intervene") return "diligent";
  if (ctx.firstChoice === "distort") return "restless"; // TODO: trickster 직업 정의 필요
  return "observer"; // 기본값
}

function HeaderStats() {
  const { state } = useGame();
  const { fame, famePerSec: fps, archetype } = state; // archetype 가져오기

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
  const { state } = useGame();
  const { currentJobId } = state;

  if (!currentJobId) {
    return null; // 직업이 선택되지 않았을 경우 아무것도 렌더링하지 않음
  }

  const currentJob = JOBS[currentJobId];

  return (
    <section className="mb-10 space-y-4">
      <IdentityCard
        title={currentJob.name}
        description={currentJob.description}
        bonuses={currentJob.bonuses}
      />
      {/* 추후 swipe용 */}
    </section>
  );
}

function ActionSection() {
  const { dispatch, actions } = useGame();
  const { generateGameSituation } = actions;
  const [showPhilosophy, setShowPhilosophy] = useState(false);
  const [showDetailedPhilosophy, setShowDetailedPhilosophy] = useState(false);

  const handleResearch = async () => {
    // "연구하기" 클릭 시 상황 발생
    try {
      const result = await generateGameSituation({ situationType: "research" }); // 상황 생성
      if (result) {
        dispatch({ type: "SET_SITUATION", text: result.situationText, options: result.options }); // 상황 텍스트 및 선택지 설정
      }
    } catch (error) {
      console.error("Error generating research situation:", error);
    }
  };

  const handleExpedition = async () => {
    // "탐험 보내기" 클릭 시 상황 발생
    try {
      const result = await generateGameSituation({ situationType: "expedition" }); // 상황 생성
      if (result) {
        dispatch({ type: "SET_SITUATION", text: result.situationText, options: result.options }); // 상황 텍스트 및 선택지 설정
      }
    } catch (error) {
      console.error("Error generating expedition situation:", error);
    }
  };

  return (
    <>
      {/* 게임 철학 패널 */}
      <section className="mb-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-200">
        <button 
          onClick={() => setShowPhilosophy(!showPhilosophy)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">💡</span>
            <span className="text-sm font-medium text-purple-800">
              이 게임은 다릅니다
            </span>
          </div>
          <span className="text-purple-600">{showPhilosophy ? "−" : "+"}</span>
        </button>
        
        {showPhilosophy && (
          <div className="mt-3 space-y-2 text-xs text-gray-700 animate-fade-in">
            <div className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              <span><strong>능력치 없음:</strong> 레벨이나 스탯이 없습니다. 칭호가 당신의 정체성입니다.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              <span><strong>정답 없음:</strong> 모든 선택은 다른 이야기로 이어집니다.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              <span><strong>반복 플레이:</strong> 환생을 통해 새로운 칭호를 발견하세요.</span>
            </div>
            <button
              onClick={() => {
                const PhilosophyScreen = require("./PhilosophyScreen").default;
                setShowDetailedPhilosophy(true);
              }}
              className="mt-2 w-full text-center text-xs text-purple-600 hover:text-purple-800 font-medium py-2 bg-white rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors"
            >
              자세히 보기 →
            </button>
          </div>
        )}
      </section>
      
      <section className="mb-10 grid grid-cols-2 gap-4">
        <ActionCard
          title="연구하기"
          description="다음 성향 변화: 질서 ↑"
          onClick={handleResearch} // onClick 핸들러 추가
        />
        <ActionCard
          title="탐험 보내기"
          description="위험도 ★★★"
          onClick={handleExpedition} // onClick 핸들러 추가
        />
      </section>
    </>
  );
}

function BottomNav({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [currentTab, setCurrentTab] = useState("홈");

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
    onNavigate(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="mx-auto flex max-w-md justify-around py-3">
        <button 
          onClick={() => handleTabClick("홈")}
          className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
            currentTab === "홈" ? "text-purple-600" : "text-gray-400"
          }`}
        >
          <span className="text-xl">🏠</span>
          <span className="text-xs font-medium">홈</span>
        </button>
        
        <button 
          onClick={() => handleTabClick("칭호")}
          className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
            currentTab === "칭호" ? "text-purple-600" : "text-gray-400"
          }`}
        >
          <span className="text-xl">📜</span>
          <span className="text-xs font-medium">칭호</span>
        </button>
        
        <button 
          onClick={() => handleTabClick("업적")}
          className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
            currentTab === "업적" ? "text-purple-600" : "text-gray-400"
          }`}
        >
          <span className="text-xl">🏆</span>
          <span className="text-xs font-medium">업적</span>
        </button>
        
        <button 
          onClick={() => handleTabClick("제안")}
          className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
            currentTab === "제안" ? "text-purple-600" : "text-gray-400"
          }`}
        >
          <span className="text-xl">✨</span>
          <span className="text-xs font-medium">제안</span>
        </button>
      </div>
    </nav>
  );
}

export default function HomeScreen() {
  const { state, dispatch, actions } = useGame();
  const { analyzePlayerIntent, generateGameSituation } = actions;
  const { currentChainLength, currentJobId, currentSituation } = state; // currentSituation 객체 가져오기
  const [showJobSuggestion, setShowJobSuggestion] = useState(false);
  const [suggestedJobId, setSuggestedJobId] = useState<string | undefined>(undefined);
  const [currentScreen, setCurrentScreen] = useState<"home" | "titles" | "achievements" | "ugc" | "philosophy">("home");

  useEffect(() => {
    // TODO: 첫 탐험 후 직업 제안 로직
    // 임시로 currentChainLength가 1일 때 직업 제안이 뜨도록 설정
    if (currentChainLength === 1 && !currentJobId && !showJobSuggestion && !currentSituation) { // 일반 상황이 없는 경우에만 직업 제안
      // TODO: 첫 상황의 choiceId를 가져오는 로직 필요
      const firstChoice: "observe" | "intervene" | "distort" = "observe"; // 임시값
      const suggested = suggestInitialJob({ firstChoice });
      setSuggestedJobId(suggested);
      // 직업 제안 텍스트를 Situation 객체로 설정
      dispatch({ type: "SET_SITUATION", situation: { id: "initialJobSuggestion", text: `세계는 당신의 태도를 [ ${JOBS[suggested].name} ]의 관점으로 인식하기 시작합니다.`, options: [] } });
      setShowJobSuggestion(true); // 직업 제안 버튼을 바로 띄우도록 설정
    }
  }, [currentChainLength, currentJobId, showJobSuggestion, currentSituation, dispatch]);

  // 직업 제안 또는 일반 상황 UI 렌더링
  if (currentSituation) {
    const handleSituationContinue = () => {
      // 상황 진행 로직
      dispatch({ type: "SET_SITUATION", situation: undefined }); // 상황 닫기
      // TODO: 다음 상황 생성 또는 결과 처리 로직 추가
    };

    return (
      <SituationResult
        text={currentSituation.text}
        options={currentSituation.options.map((o: { id: string; text: string; }) => o.text)} // 선택지 텍스트 전달
        onSelectOption={async (optionText: string) => {
          // 선택지 선택 시 처리
          const selectedOption = currentSituation.options.find((o: { id: string; text: string; }) => o.text === optionText);
          if (selectedOption) {
            await analyzePlayerIntent(currentSituation.id, selectedOption.id, optionText); // 플레이어 의도 분석
            dispatch({ type: "SET_SITUATION", situation: undefined }); // 상황 닫기
          }
        }} 
        showJobSuggestionButtons={showJobSuggestion}
        suggestedJobName={suggestedJobId ? JOBS[suggestedJobId]?.name : undefined}
        onAcceptJob={showJobSuggestion ? () => {
          dispatch({ type: "SET_CURRENT_JOB", jobId: suggestedJobId!, introducedAt: Date.now() });
          setShowJobSuggestion(false);
          setSuggestedJobId(undefined);
          dispatch({ type: "SET_SITUATION", situation: undefined }); // 직업 제안 완료 후 상황 초기화
        } : undefined}
        onDeclineJob={showJobSuggestion ? () => {
          setShowJobSuggestion(false);
          setSuggestedJobId(undefined);
          dispatch({ type: "SET_SITUATION", situation: undefined }); // 직업 제안 거절 후 상황 초기화
          // TODO: 보류 시 재제안 쿨타임 로직 추가 (X5 항목)
        } : undefined}
        onContinue={handleSituationContinue} // 일반 상황 계속하기 핸들러 사용
      />
    );
  }

  // 화면 라우팅
  if (currentScreen === "titles") {
    return <TitleCodexScreen onBack={() => setCurrentScreen("home")} />;
  }
  
  if (currentScreen === "achievements") {
    const AchievementScreen = require("./AchievementScreen").default;
    return <AchievementScreen onBack={() => setCurrentScreen("home")} />;
  }
  
  if (currentScreen === "ugc") {
    const UGCSubmissionScreen = require("./UGCSubmissionScreen").default;
    return <UGCSubmissionScreen onBack={() => setCurrentScreen("home")} />;
  }
  
  if (currentScreen === "philosophy") {
    const PhilosophyScreen = require("./PhilosophyScreen").default;
    return <PhilosophyScreen onBack={() => setCurrentScreen("home")} />;
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-5 pt-6 pb-24">
      <AIStatusIndicator aiEnabled={true} usingFallback={false} />
      <HeaderStats />
      <IdentityCardCarousel />
      <ActionSection />
      <PrestigeProgress progress={80} message="환생 시 신규 칭호 가능" /> {/* TODO: 환생 진행률 및 메시지 동적 연동 */}
      <BottomNav onNavigate={(tab) => {
        if (tab === "홈") setCurrentScreen("home");
        else if (tab === "칭호") setCurrentScreen("titles");
        else if (tab === "업적") setCurrentScreen("achievements");
        else if (tab === "제안") setCurrentScreen("ugc");
      }} />
    </main>
  );
}