
import React from "react";
import { createRoot } from "react-dom/client";
import { GameProvider } from "./app/providers/GameProvider.tsx";
import App from "./app/App.tsx";
import "./styles/index.css";

// Firebase 관련 임포트 추가
import { app } from "./firebase/config.ts"; // 초기화된 Firebase app 임포트
import { getFunctions } from "firebase/functions";

export const functions = getFunctions(app); // functions 인스턴스 내보내기

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>
);