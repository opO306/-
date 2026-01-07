// functions/index.ts
import * as admin from "firebase-admin";
admin.initializeApp();

// AI 호출 Cloud Functions
export { genSituation } from "./src/functions/genSituation"; // 기존 genSituation
export { analyzeIntent } from "./src/functions/analyzeIntent"; // 기존 analyzeIntent

// TODO: 다른 Cloud Functions들도 이곳에서 export
