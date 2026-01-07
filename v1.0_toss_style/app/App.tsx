import { useEffect, useState } from "react"
import { initialGameState } from "../game/initialState"
import { applyChoice } from "../game/logic/reincarnation"
import { ChoiceType } from "../types/game"

function getJobTitle(identity: string) {
  if (identity === "Honorable") return "기사"
  if (identity === "Questioned") return "의심받는 기사"
  if (identity === "Dishonored") return "타락한 기사"
  if (identity === "Infamous") return "악명 높은 기사"
  return "이름 없는 자"
}

export default function App() {
  const [state, setState] = useState(initialGameState)

  useEffect(() => {
    const timer = setInterval(() => {
      setState((prev) => ({
        ...prev,
        time: prev.time + 1,
        gold: prev.gold + 1,
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  function onChoice(choice: ChoiceType) {
    setState((prev) => applyChoice(prev, choice))
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans p-6">
      <div className="max-w-md mx-auto space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{getJobTitle(state.identityState)}</h1>
          <p className="text-sm text-gray-500">시간: {state.time}초 / 골드: {state.gold}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onChoice("Help")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl py-2 px-4 transition"
          >
            돕는다
          </button>
          <button
            onClick={() => onChoice("Profit")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl py-2 px-4 transition"
          >
            이익을 취한다
          </button>
          <button
            onClick={() => onChoice("Betray")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl py-2 px-4 transition"
          >
            배신한다
          </button>
        </div>

        <div className="pt-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 px-6 font-semibold transition">
            환생한다
          </button>
        </div>

        {/* 디버그 정보 */}
        <div className="pt-8 text-sm text-gray-700 space-y-2">
          <h2 className="font-semibold text-base">🛠️ 게임 상태 (디버그)</h2>
          <p>기본 직업: {state.baseJob}</p>
          <p>서약: {state.oath ?? "없음"}</p>
          <p>명성: {state.reputation}</p>
          <p>정체성 상태: {state.identityState}</p>
          <p className="font-semibold mt-2">선택 로그:</p>
          {state.logs.choices.length === 0 ? (
            <p className="text-gray-400">아직 선택 없음</p>
          ) : (
            <ul className="list-disc list-inside">
              {state.logs.choices.map((c, i) => (
                <li key={i}>
                  [{c.time}s] {c.choice}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}
