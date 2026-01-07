/**
 * 전직 관련 타입 정의
 */

export type JobType = 'diligent' | 'restless' | 'observer' | 'trickster';

export interface Job {
  id: JobType;
  name: string;
  tags: string[]; // tag를 tags (string 배열)로 변경
  description: string;
  perspectivePrompt: string; // 직업 관점 프롬프트 추가
  bonuses: { label: string; value: string }[]; // 직업 보너스 추가
}
