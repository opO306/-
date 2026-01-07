import { Job } from '../types/job';
import { Title } from '../types/title';
import { httpsCallable } from "firebase/functions";
import { functions as appFunctions } from "../firebase/config";

export interface ComposedJob {
  baseJobId: string;
  displayName: string; // UI에 표시
  description: string; // AI가 생성한 설명 추가
}

export async function composeJob(
  currentJob: Job,
  newTitle: Title
): Promise<ComposedJob> {
  const composeJobCallable = httpsCallable(appFunctions, 'composeJob');
  try {
    const result = await composeJobCallable({ currentJob, newTitle });
    // @ts-ignore
    return result.data as ComposedJob;
  } catch (error) {
    console.error("Error calling composeJob Cloud Function:", error);
    // Fallback 로직 (기존 composeJob의 fallback과 유사하게 구현)
    const composedJobName = `${newTitle.label} ${currentJob.name}`;
    const composedJobDescription = `${currentJob.description} 이 칭호(${newTitle.label})로 인해 새로운 운명을 맞이합니다.`;
    return {
      baseJobId: currentJob.id,
      displayName: composedJobName,
      description: composedJobDescription,
    };
  }
}

