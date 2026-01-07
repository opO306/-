import { useEffect, useState } from "react"
import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore"

interface ChoiceLog {
  time: number
  choice: "Help" | "Profit" | "Betray"
}

export default function ChoiceStats() {
  const [total, setTotal] = useState(0)
  const [counts, setCounts] = useState({
    Help: 0,
    Profit: 0,
    Betray: 0,
  })

  useEffect(() => {
    async function loadStats() {
      const db = getFirestore()
      const uid = "test-user"
      const ref = collection(db, "users", uid, "rebirths")
      const snapshot = await getDocs(ref)

      const allChoices: ChoiceLog[] = []
      snapshot.docs.forEach((doc) => {
        const data = doc.data()
        if (data.choices && Array.isArray(data.choices)) {
          allChoices.push(...data.choices)
        }
      })

      const stat = { Help: 0, Profit: 0, Betray: 0 }
      for (const c of allChoices) {
        if (c.choice in stat) {
          stat[c.choice as "Help" | "Profit" | "Betray"]++
        }
      }

      setTotal(allChoices.length)
      setCounts(stat)
    }

    loadStats()
  }, [])

  function percent(value: number) {
    return total === 0 ? "0%" : `${Math.round((value / total) * 100)}%`
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <h2 className="text-xl font-bold">📊 선택 유형 통계</h2>
        <p className="text-sm text-gray-500">전체 선택 수: {total}회</p>
        <ul className="list-none space-y-2 text-sm">
          <li>🟩 돕는다: {counts.Help}회 ({percent(counts.Help)})</li>
          <li>🟨 이익을 취한다: {counts.Profit}회 ({percent(counts.Profit)})</li>
          <li>🟥 배신한다: {counts.Betray}회 ({percent(counts.Betray)})</li>
        </ul>
      </div>
    </main>
  )
}