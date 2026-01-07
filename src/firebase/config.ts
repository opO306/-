import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase 구성 객체
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebase 앱 초기화
export const app = initializeApp(firebaseConfig); // app을 export

// Firestore 인스턴스 가져오기
export const db = getFirestore(app);
