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
      const uid = "test-user" // TODO: 실제 로그인 연동
      const ref = collection(db, "users", uid, "rebirths")
      const q = query(ref, orderBy("createdAt", "desc"))
      const snapshot = await getDocs(q)

      const data = snapshot.docs.map((doc) => doc.data() as RebirthRecord)
      setRecords(data)
    }

    loadData()
  }, [])

  return (
    <div style={{ padding: 16 }}>
      <h2>내 전생 모아보기</h2>

      {records.length === 0 && <p>아직 환생한 기록이 없습니다.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {records.map((r, i) => (
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
              <strong>🏷️ {r.title}</strong>
            </div>
            <div style={{ fontSize: 14, marginTop: 4 }}>{r.summary}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
              직업: {r.baseJob} / {new Date(r.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

