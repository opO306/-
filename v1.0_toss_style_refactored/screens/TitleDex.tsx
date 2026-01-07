import { useEffect, useState } from "react"
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore"

interface RebirthRecord {
  title: string
  summary: string
  createdAt: number
}

export default function TitleDex() {
  const [uniqueTitles, setUniqueTitles] = useState<RebirthRecord[]>([])

  useEffect(() => {
    async function loadTitles() {
      const db = getFirestore()
      const uid = "test-user"
      const ref = collection(db, "users", uid, "rebirths")
      const q = query(ref, orderBy("createdAt", "desc"))
      const snapshot = await getDocs(q)

      const seen = new Set<string>()
      const titles: RebirthRecord[] = []

      snapshot.docs.forEach((doc) => {
        const data = doc.data() as RebirthRecord
        if (!seen.has(data.title)) {
          seen.add(data.title)
          titles.push(data)
        }
      })

      setUniqueTitles(titles)
    }

    loadTitles()
  }, [])

  return (
    <main className="min-h-screen bg-white text-gray-900 p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <h2 className="text-xl font-bold">🏷️ 칭호 도감</h2>
        {uniqueTitles.length === 0 ? (
          <p className="text-gray-400">얻은 칭호가 없습니다.</p>
        ) : (
          <ul className="list-none space-y-4">
            {uniqueTitles.map((t, i) => (
              <li
                key={i}
                className="rounded-xl border border-gray-200 p-4 bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="text-lg font-semibold text-blue-600">{t.title}</div>
                <div className="text-sm text-gray-700 mt-1">{t.summary}</div>
                <div className="text-xs text-gray-500 mt-2">
                  얻은 시점: {new Date(t.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}