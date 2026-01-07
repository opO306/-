import { Title } from '../types/game';
import { Job } from '../types/job';

export function buildComposedJobPrompt(currentJob: Job, newTitle: Title) {
  return `
현재 직업: ${currentJob.name} (${currentJob.description})
새롭게 획득한 칭호: ${newTitle.label} (태그: ${newTitle.tags.join(', ')})

위 정보를 바탕으로 플레이어에게 부여할 새로운 직업의 이름과 설명을 제안해주세요.

조건:
- 기존 직업과 칭호의 특징을 창의적으로 조합할 것.
- 새로운 직업은 매력적이고, 플레이어에게 다음 목표를 제시할 수 있는 방향성을 포함할 것.
- 출력 형식은 JSON으로 하며, "name"과 "description" 필드를 포함할 것.

예시:
{
  "name": "황혼의 기사",
  "description": "타락한 자들을 심판하는 동시에 그들의 고통을 이해하는, 모순적인 운명을 짊어진 기사."
}
`;
}

