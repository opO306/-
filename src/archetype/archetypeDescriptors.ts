import { AxisDescriptor } from "./types";

export const ORDER_CHAOS: AxisDescriptor[] = [
  { range: [-100, -60], text: "강한 질서 성향" },
  { range: [-59, -20], text: "질서를 중시함" },
  { range: [-19, 19], text: "균형을 유지 중" },
  { range: [20, 59], text: "혼돈에 기울고 있음" },
  { range: [60, 100], text: "강한 혼돈 성향" },
];

export const ALTRUISM_SELF: AxisDescriptor[] = [
  { range: [-100, -60], text: "강한 이타적 성향" },
  { range: [-59, -20], text: "타인을 우선함" },
  { range: [-19, 19], text: "중립적 태도" },
  { range: [20, 59], text: "자기중심적 판단 증가" },
  { range: [60, 100], text: "강한 사리추구 성향" },
];

export const ASCETIC_HEDON: AxisDescriptor[] = [
  { range: [-100, -60], text: "극단적 금욕 성향" },
  { range: [-59, -20], text: "절제된 선택을 선호" },
  { range: [-19, 19], text: "욕망을 통제 중" },
  { range: [20, 59], text: "쾌락을 추구하기 시작" },
  { range: [60, 100], text: "강한 쾌락주의" },
];

export const KNOWLEDGE_DESTRUCTION: AxisDescriptor[] = [
  { range: [-100, -60], text: "이해와 분석에 집착" },
  { range: [-59, -20], text: "지식을 축적 중" },
  { range: [-19, 19], text: "탐구와 파괴 사이" },
  { range: [20, 59], text: "파괴적 선택 증가" },
  { range: [60, 100], text: "순수한 파괴 성향" },
];
