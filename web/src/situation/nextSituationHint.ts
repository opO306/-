import { SituationResultType } from "./resultType";

export type NextSituationHint = {
  tone: string;
  riskLevel: "low" | "medium" | "high";
};

export function getNextSituationHint(
  result: SituationResultType
): NextSituationHint {
  switch (result) {
    case "stabilized":
      return {
        tone: "차분하지만 여파가 남아 있는 상황",
        riskLevel: "low",
      };
    case "observed":
      return {
        tone: "겉보기엔 조용하지만 내면이 축적된 상황",
        riskLevel: "medium",
      };
    case "unresolved":
      return {
        tone: "문제가 남아 더 복잡해진 상황",
        riskLevel: "high",
      };
    case "distorted":
      return {
        tone: "원래와 다른 방향으로 흐른 상황",
        riskLevel: "high",
      };
    case "escalated":
      return {
        tone: "사태가 확대되어 긴장이 커진 상황",
        riskLevel: "high",
      };
  }
}

