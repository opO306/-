import { useEffect, useState } from "react";
import {
  requestReincarnationAnalysis,
  parseReincarnationText,
  resolveNextJob
} from "../game/reincarnation";
import { Job } from "../game/jobMapping";

export function ReincarnationScreen({
  gameState,
  onContinue
}: {
  gameState: any; // TODO: gameState 타입 정의 필요
  onContinue: (nextJob?: Job) => void;
}) {
  const [result, setResult] = useState<{
    summary: string;
    title: string;
    description: string;
  } | null>(null);
  const [nextJobResolution, setNextJobResolution] = useState<
    { mode: "AUTO"; job: Job } | { mode: "CHOICE"; options: Job[] } | null
  >(null);

  useEffect(() => {
    async function run() {
      try {
        const raw = await requestReincarnationAnalysis({
          job: gameState.baseJob,
          oath: gameState.oath,
          finalIdentity: gameState.identityState,
          reputationTrend:
            gameState.reputation < 0 ? "declining into infamy" : "unstable",
          notableBehaviors: gameState.logs.choices.map((c: any) => c.type)
        });

        const parsedResult = parseReincarnationText(raw);
        setResult(parsedResult);

        const jobResolution = resolveNextJob(parsedResult.title);
        setNextJobResolution(jobResolution);
      } catch (error) {
        console.error("환생 분석 실패:", error);
        // 에러 발생 시 대체 UI 또는 메시지 표시
        setResult({ summary: "분석 실패", title: "에러 발생", description: "환생 정보를 불러오는 데 실패했습니다." });
        setNextJobResolution({ mode: "AUTO", job: "Citizen" as any }); // 기본 직업으로 폴백
      }
    }

    run();
  }, [gameState]);

  if (!result || !nextJobResolution) {
    return <div style={{ padding: 24 }}>시간이 흐르고 있습니다…</div>;
  }

  const handleContinue = (selectedJob?: Job) => {
    onContinue(selectedJob);
  };

  return (
    <div style={{ padding: 24 }}>
      <p style={{ opacity: 0.7 }}>{result.summary}</p>

      <h2 style={{ marginTop: 32 }}>{result.title}</h2>
      <p style={{ opacity: 0.8 }}>{result.description}</p>

      {nextJobResolution.mode === "AUTO" && (
        <div style={{ marginTop: 48 }}>
          <p>당신은 이제 <span style={{ fontWeight: 'bold' }}>[{nextJobResolution.job}]</span>으로 살아가게 됩니다.</p>
          <button style={{ marginTop: 24 }} onClick={() => handleContinue(nextJobResolution.job)}>
            다음 시대
          </button>
        </div>
      )}

      {nextJobResolution.mode === "CHOICE" && (
        <div style={{ marginTop: 48 }}>
          <p>이후의 삶은, 여러 갈래로 이어질 수 있습니다.</p>
          {nextJobResolution.options.map((jobOption) => (
            <button
              key={jobOption}
              style={{ marginTop: 12, marginRight: 12 }}
              onClick={() => handleContinue(jobOption)}
            >
              {jobOption}로 산다
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

