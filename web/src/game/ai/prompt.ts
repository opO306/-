import { GameState } from '../../app/providers/GameProvider';

export function buildRebirthPrompt(gameState: GameState): string {
    const choicesLog = gameState.logs.choices.map(log => log.type).join(', ');
    const prompt = `
플레이어가 환생했습니다. 이전 생의 기록은 다음과 같습니다:
- 기본 직업: ${gameState.baseJob}
- 서약: ${gameState.oath || '없음'}
- 명성: ${gameState.reputation}
- 정체성 상태: ${gameState.identityState}
- 했던 행동들 (선택 로그): ${choicesLog || '없음'}

이 플레이어의 이전 생을 짧게 요약하고, 그에 어울리는 새로운 칭호를 하나 만들어주세요.
응답은 JSON 형식으로 해주세요:
{
  "summary": "플레이어의 이전 생에 대한 한두 문장 요약",
  "title": "플레이어에게 부여할 새로운 칭호 (두세 단어)"
}
`;
    return prompt;
}

export interface PlayerChoiceRates {
    total: number;
    helpRate: number;
    profitRate: number;
    betrayRate: number;
}

export function buildProfilePrompt(rates: PlayerChoiceRates): string {
    const prompt = `
플레이어의 이전 생에서의 선택 비율은 다음과 같습니다:
- 총 선택 횟수: ${rates.total}
- 돕는다 선택 비율: ${rates.helpRate}%
- 이익을 취한다 선택 비율: ${rates.profitRate}%
- 배신한다 선택 비율: ${rates.betrayRate}%

이 플레이어의 선택 비율을 바탕으로 성향을 분석하고, 그에 어울리는 짧은 프로필 타입 (예: "이타주의자", "기회주의자", "악인")과 한 문장 요약을 만들어주세요.
응답은 JSON 형식으로 해주세요:
{
  "profileType": "플레이어의 성향을 나타내는 짧은 단어",
  "profileSummary": "플레이어의 성향에 대한 한 문장 요약"
}
`;
    return prompt;
}
