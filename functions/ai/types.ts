// functions/ai/types.ts
export type AIResult = {
  text: string;
  model: string;
};

export interface TextGenerator {
  generate(prompt: string): Promise<AIResult>;
}

export interface IntentClassifier {
  classify(text: string): Promise<string | null>;
}

