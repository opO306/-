// functions/ai/factory.ts
import { OpenAISituationGenerator } from "./openaiGenerator";
import { GeminiIntentClassifier } from "./geminiIntentClassifier";
import { TextGenerator, IntentClassifier } from "./types"; // types 임포트

export const situationGenerator: TextGenerator =
  new OpenAISituationGenerator();

export const intentClassifier: IntentClassifier =
  new GeminiIntentClassifier();
