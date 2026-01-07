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
  const [uniqueTitles, setUniqueTitles] = useState<
    { title: string; summary: string; createdAt: number }[]
  >([])

  useEffect(() => {
    async function loadTitles() {
      const db = getFirestore()
      const uid = "test-user" // TODO: 실제 로그인 연동
      const ref = collection(db, "users", uid, "rebirths")
      const q = query(ref, orderBy("createdAt", "desc"))
      const snapshot = await getDocs(q)

      const seen = new Set<string>()
      const titles: { title: string; summary: string; createdAt: number }[] = []

      snapshot.docs.forEach((doc) => {
        const data = doc.data() as RebirthRecord
        if (!seen.has(data.title)) {
          seen.add(data.title)
          titles.push({
            title: data.title,
            summary: data.summary,
            createdAt: data.createdAt,
          })
        }
      })

      setUniqueTitles(titles)
    }

    loadTitles()
  }, [])

  return (
    <div style={{ padding: 16 }}>
      <h2>🏷️ 칭호 도감</h2>
      {uniqueTitles.length === 0 && <p>얻은 칭호가 없습니다.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {uniqueTitles.map((t, i) => (
          <li
            key={i}
            style={{
              marginBottom: 16,
              padding: 12,
              border: "1px solid #ccc",
              borderRadius: 8,
            }}
          >
            <div>
              <strong>{t.title}</strong>
            </div>
            <div style={{ fontSize: 14, marginTop: 4 }}>{t.summary}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
              얻은 시점: {new Date(t.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

