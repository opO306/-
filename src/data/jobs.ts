/**
 * 전직 데이터
 */

import { Job } from '../types/job';

export const JOBS: Record<string, Job> = {
  diligent: {
    id: 'diligent',
    name: '성실한 초보자',
    tags: ['성실', '성장', '온라인'], // 직업 태그 추가
    description: '꾸준함이 힘이다. 온라인일 때 더 빠르게 성장한다.',
    perspectivePrompt: "성실한 초보자의 관점에서 상황을 인식한다",
    bonuses: [],
  },
  restless: {
    id: 'restless',
    name: '쉼 없는 자',
    tags: ['꾸준함', '활동', '오프라인'], // 직업 태그 추가
    description: '쉬지 않고 움직인다. 온/오프라인 구분 없이 항상 움직인다.',
    perspectivePrompt: "쉼 없는 자의 관점에서 상황을 인식한다",
    bonuses: [],
  },
  observer: {
    id: 'observer',
    name: '방관자',
    tags: ['관찰', '지식', '느림'], // 직업 태그 추가
    description: '시간이 흘러도 성장한다. XP를 더 많이 얻지만 느리게 행동한다.',
    perspectivePrompt: "방관자의 관점에서 상황을 인식한다",
    bonuses: [
      { label: "연구 효율", value: "+15%" },
      { label: "환생 보너스", value: "+8%" },
    ],
  },
};
