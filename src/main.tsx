
import React from "react";
import { createRoot } from "react-dom/client";
import { GameProvider } from "./app/providers/GameProvider.tsx";
import HomeScreen from "./screens/HomeScreen.tsx";
import "./styles/index.css";

// Firebase 관련 임포트 추가
import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";

// TODO: Firebase 설정 정보 추가 (환경 변수 사용 권장)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app); // functions 인스턴스 내보내기

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GameProvider>
      <HomeScreen />
    </GameProvider>
  </React.StrictMode>
);