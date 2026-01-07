import { useEffect, useState } from "react"
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore"

interface RebirthRecord {
  createdAt: number
  baseJob: string
  title: string
  summary: string
}

export default function RebirthHistory() {
  const [records, setRecords] = useState<RebirthRecord[]>([])

  useEffect(() => {
    async function loadData() {
      const db = getFirestore()
      const uid = "test-user"
      const ref = collection(db, "users", uid, "rebirths")
      const q = query(ref, orderBy("createdAt", "desc"))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map((doc) => doc.data() as RebirthRecord)
      setRecords(data)
    }

    loadData()
  }, [])

  return (
    <main className="min-h-screen bg-white text-gray-900 p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <h2 className="text-xl font-bold">내 전생 모아보기</h2>
        {records.length === 0 ? (
          <p className="text-gray-400">아직 환생한 기록이 없습니다.</p>
        ) : (
          <ul className="list-none space-y-4">
            {records.map((r, i) => (
              <li
                key={i}
                className="rounded-xl border border-gray-200 p-4 bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="text-lg font-semibold text-blue-600">{r.title}</div>
                <div className="text-sm mt-1 text-gray-700">{r.summary}</div>
                <div className="text-xs text-gray-500 mt-2">
                  직업: {r.baseJob} / {new Date(r.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}