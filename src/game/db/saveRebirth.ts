import { collection, addDoc } from "firebase/firestore";
import { GameState, RebirthRecord } from "../../types/game"; // RebirthRecord 임포트
import { db } from '../../firebase/config'; // 초기화된 db 인스턴스 임포트

export async function saveRebirthToFirestore(
  uid: string,
  state: GameState,
  result: { title: string; summary: string }
) {
  const choicesForDb = state.logs.choices.map(log => ({
    time: log.timestamp,
    choice: log.type,
  }));

  const doc: RebirthRecord = {
    createdAt: Date.now(),
    baseJob: state.baseJob,
    oath: state.oath ?? null,
    choices: choicesForDb,
    finalReputation: state.reputation,
    finalIdentityState: state.identityState,
    title: result.title,
    summary: result.summary,
  };

  const ref = collection(db, "users", uid, "rebirths");
  await addDoc(ref, doc);
}
