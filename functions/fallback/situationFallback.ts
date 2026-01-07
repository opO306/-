// fallback/situationFallback.ts
import { SituationGenInput } from "../types/situation";

export function fallbackSituationText(input: SituationGenInput): string {
  // TODO: input을 기반으로 좀 더 정교한 Fallback 텍스트 생성 로직 구현
  if (input.chainHint?.riskLevel === "high") {
    return "상황은 이전보다 복잡해져 있다.\n지금의 선택이 중요해 보인다.";
  }

  // 직업 태그를 활용한 Fallback 예시
  if (input.jobTags.includes("관찰")) {
    return "주변을 관찰하니 새로운 단서가 보인다.\n조심스럽게 상황을 지켜보자.";
  }

  return "특별한 변화는 없지만,\n상황은 계속 이어지고 있다.";
}

