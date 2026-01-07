
// src/game/logic/reincarnation.ts

/**
 * 1. 타입 정의
 * 이 섹션에서는 환생 로직에 필요한 모든 타입을 정의합니다.
 */

// 1-1. 성향 벡터
export type AlignmentVector = {
  orderChaos: number;          // -100 질서 ← → 혼돈 +100
  altruismSelf: number;        // -100 이타 ← → 이기 +100
  creationDestruction: number; // -100 창조 ← → 파괴 +100
  stabilityChange: number;     // -100 안정 ← → 변화 +100
};

// 1-2. 로그
export type ChoiceCategory = "help" | "destroy" | "build" | "explore" | "exploit";
export type BehaviorMetric = "repetition" | "efficiency" | "risk" | "hoarding";

export type ChoiceLog = {
  type: "choice";
  category: ChoiceCategory;
  weight: number; // 중요도
};

export type BehaviorLog = {
  type: "behavior";
  metric: BehaviorMetric;
  value: number;
};

// 1-3. 칭호 태그
export type TitleTag =
  | "order"
  | "chaos"
  | "altruistic"
  | "selfish"
  | "creation"
  | "destruction"
  | "nature"
  | "industry"
  | "risk"
  | "efficiency";

export type Title = {
  name: string;        // AI가 생성
  description: string; // AI가 생성
  tags: Partial<Record<TitleTag, number>>; // 코드가 생성
};

// 1-4. 기본 직업 (상세 설계에 따라 확장될 수 있습니다)
export type BaseJob = "Citizen" | "Warrior" | "Mage" | "Artisan" | "Scholar" | "Outcast";

// 1-5. 합성 직업
export type CompositeJob = {
  id: string;
  name: string;        // AI가 생성
  flavorText: string; // AI가 생성
  baseJob: BaseJob;
  modifiers: {
    resourceGain: number;
    growthRate: number;
    specialRule?: string;
  };
};

// 1-6. 게임 상태
export type GameState = {
  run: {
    day: number;
    baseJob: BaseJob;
    compositeJob?: CompositeJob;
  };
  alignment: AlignmentVector;
  currentTitle?: Title;
  logs: {
    choices: ChoiceLog[];
    behaviors: BehaviorLog[];
  };
};

/**
 * 2. 로그 집계 및 성향 벡터 계산
 * 플레이 로그를 기반으로 AlignmentVector를 계산하는 함수들입니다.
 */

const initialAlignment: AlignmentVector = {
  orderChaos: 0,
  altruismSelf: 0,
  creationDestruction: 0,
  stabilityChange: 0,
};

// 성향 값 클램프 함수
function clampAlignmentValue(value: number): number {
  return Math.max(-100, Math.min(100, value));
}

// ChoiceLog 적용 함수
function applyChoiceLog(alignment: AlignmentVector, log: ChoiceLog): AlignmentVector {
  const impact = log.weight; // weight를 직접 impact로 사용

  switch (log.category) {
    case "help":
      alignment.altruismSelf -= (5 * impact);
      break;
    case "destroy":
      alignment.creationDestruction += (6 * impact);
      break;
    case "build":
      alignment.creationDestruction -= (5 * impact);
      break;
    case "explore":
      alignment.stabilityChange += (4 * impact);
      break;
    case "exploit":
      alignment.altruismSelf += (6 * impact);
      break;
  }
  return alignment;
}

// BehaviorLog 적용 함수
function applyBehaviorLog(alignment: AlignmentVector, log: BehaviorLog): AlignmentVector {
  const impact = log.value; // value를 직접 impact로 사용

  switch (log.metric) {
    case "repetition":
      alignment.orderChaos -= (3 * impact);
      break;
    case "efficiency":
      alignment.orderChaos -= (2 * impact);
      break;
    case "risk":
      alignment.stabilityChange += (5 * impact);
      break;
    case "hoarding":
      alignment.altruismSelf += (4 * impact);
      break;
  }
  return alignment;
}

// 모든 로그를 처리하여 최종 AlignmentVector를 계산하는 함수
export function calculateAlignmentVector(
  currentLogs: { choices: ChoiceLog[]; behaviors: BehaviorLog[] }
): AlignmentVector {
  let alignment = { ...initialAlignment }; // 초기값 복사

  for (const log of currentLogs.choices) {
    alignment = applyChoiceLog(alignment, log);
  }
  for (const log of currentLogs.behaviors) {
    alignment = applyBehaviorLog(alignment, log);
  }

  // 모든 축에 대해 클램프 적용
  alignment.orderChaos = clampAlignmentValue(alignment.orderChaos);
  alignment.altruismSelf = clampAlignmentValue(alignment.altruismSelf);
  alignment.creationDestruction = clampAlignmentValue(alignment.creationDestruction);
  alignment.stabilityChange = clampAlignmentValue(alignment.stabilityChange);

  return alignment;
}

/**
 * 3. 성향 → 칭호 태그 매핑
 * 계산된 AlignmentVector를 기반으로 칭호 태그를 생성합니다.
 */
export function generateTitleTags(alignment: AlignmentVector, currentLogs: { choices: ChoiceLog[]; behaviors: BehaviorLog[] }): Partial<Record<TitleTag, number>> {
    const tags: Partial<Record<TitleTag, number>> = {};

    // 성향 기반 태그
    if (alignment.orderChaos <= -50) tags.order = 3;
    if (alignment.orderChaos >= 50) tags.chaos = 3;
    if (alignment.altruismSelf <= -40) tags.altruistic = 2;
    if (alignment.altruismSelf >= 40) tags.selfish = 2;
    if (alignment.creationDestruction <= -50) tags.creation = 3;
    if (alignment.creationDestruction >= 50) tags.destruction = 3;
    if (alignment.stabilityChange >= 40) tags.risk = 2;

    // 행동 로그 기반 태그 (예시)
    const repetitionCount = currentLogs.behaviors.filter(log => log.metric === "repetition").reduce((sum, log) => sum + log.value, 0);
    if (repetitionCount > 5) tags.efficiency = (tags.efficiency || 0) + 2; // repetition 높으면 efficiency 증가로 임시 처리 (설계에 따르면 efficiency 태그는 repetition 높음으로 부여)

    // nature / industry 태그는 행동 로그 기반으로만 부여한다고 명시되어 있으므로,
    // 관련 행동 로그가 정의되면 여기에 추가 로직을 구현합니다.
    // 예: 특정 'build' 또는 'exploit' choiceLog, 혹은 특정 behaviorLog에 따라 nature/industry 태그 부여

    return tags;
}

/**
 * 4. 기본 직업 + 태그 → 합성 직업 결정
 * 기본 직업과 칭호 태그를 조합하여 합성 직업을 결정합니다.
 */
export function determineCompositeJob(baseJob: BaseJob, titleTags: Partial<Record<TitleTag, number>>): CompositeJob["id"] {
    // 이 부분은 매우 큰 규칙 테이블이 될 수 있습니다.
    // 현재는 설계된 예시 규칙을 따릅니다.
    if (baseJob === "Citizen" && (titleTags.destruction || 0) >= 2 && (titleTags.nature || 0) <= -1) {
        return "Lumberjack";
    }
    if (baseJob === "Scholar" && (titleTags.chaos || 0) >= 2 && (titleTags.risk || 0) >= 1) {
        return "ForbiddenResearcher";
    }
    // ... 추가적인 합성 규칙들 ...

    // 매칭되는 합성 직업이 없으면 기본 직업 ID를 반환하거나, "Unemployed" 같은 기본 합성 직업을 반환
    return baseJob;
}

// AI 호출을 위한 Mock 함수 (실제 AI 서비스 연동 시 교체)
async function callAIService(
    payload: {
        alignment: AlignmentVector;
        titleTags: Partial<Record<TitleTag, number>>;
        baseJob: BaseJob;
        compositeJobId: CompositeJob["id"];
    }
): Promise<{ titleName: string; titleDescription: string; compositeJobName: string; compositeJobFlavorText: string }> {
    // 실제 AI 서비스 호출 로직 (API 요청 등)
    // 현재는 Mock 데이터 반환
    console.log("AI 서비스 호출 시뮬레이션:", payload);
    return {
        titleName: "테스트 칭호",
        titleDescription: "AI가 생성한 칭호 설명입니다.",
        compositeJobName: "테스트 합성 직업",
        compositeJobFlavorText: "AI가 생성한 합성 직업 설명입니다.",
    };
}

/**
 * 5. 최종 환생 로직 (`reincarnate` 함수)
 * 게임의 회차를 종료하고 다음 회차를 위한 새로운 상태를 반환합니다.
 */
export async function reincarnate(previousState: GameState): Promise<GameState> {
  // 1. 로그 집계 및 성향 벡터 계산
  const alignment = calculateAlignmentVector(previousState.logs);

  // 2. 태그 생성
  const titleTags = generateTitleTags(alignment, previousState.logs);

  // 3. 기본 직업 + 태그 → 직업 합성 결정 (AI가 이름만 생성하므로, ID만 먼저 결정)
  const compositeJobId = determineCompositeJob(previousState.run.baseJob, titleTags);

  // 4. AI 호출 (칭호 이름/설명 및 합성 직업 이름/설명)
  const aiResponse = await callAIService({
      alignment,
      titleTags,
      baseJob: previousState.run.baseJob,
      compositeJobId,
  });

  // 5. 다음 회차의 기본 직업 결정 (현재는 랜덤으로 가정, 실제로는 합성 직업의 영향)
  // TODO: 실제 게임 로직에 따라 다음 회차의 baseJob을 결정해야 합니다.
  const nextBaseJob: BaseJob = "Citizen"; // 임시로 Citizen으로 설정

  const newTitle: Title = {
      name: aiResponse.titleName,
      description: aiResponse.titleDescription,
      tags: titleTags,
  };

  const newCompositeJob: CompositeJob = {
      id: compositeJobId,
      name: aiResponse.compositeJobName,
      flavorText: aiResponse.compositeJobFlavorText,
      baseJob: previousState.run.baseJob, // 합성 시 사용된 기본 직업
      modifiers: { // 이 부분은 코드에서 고정된 값을 제공해야 합니다.
          resourceGain: 1.0,
          growthRate: 1.0,
          // specialRule: "..."
      },
  };

  // 6. 다음 회차 상태 초기화
  const nextState: GameState = {
    run: {
      day: 1, // 새 회차는 1일부터 시작
      baseJob: nextBaseJob,
      compositeJob: newCompositeJob,
    },
    alignment: initialAlignment, // 성향 벡터는 새 회차 시작 시 초기화
    currentTitle: newTitle,
    logs: {
      choices: [],
      behaviors: [],
    },
  };

  return nextState;
}

// 반복 고착 방지 규칙 (추후 GameState에 추가 로직으로 구현)
// 예:
// if (동일 성향 3회 반복) {
//   nextState.run.compositeJob.modifiers.growthRate *= 0.7; // 성장 계수 감소
// }
// if (chaos + risk 조합) {
//   // 특이 직업 해금 로직 (determineCompositeJob에서 처리될 수 있음)
// }
// if (efficiency 과다) {
//   // 콘텐츠 잠김 로직 (예: 특정 액션 불가)
// }

