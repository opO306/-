import React from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import { Button } from '@/app/components/ui/button';
import { Job } from '@/types/job';
import { Title } from '@/types/title';
import { ArchetypeVector } from '@/data/archetypeAxes';
import { useGame } from '../providers/GameProvider';
import { httpsCallable } from 'firebase/functions';
import { functions as appFunctions } from '../firebase/config';
import Decimal from 'break_infinity.js';

// 가상의 파생 직업 후보 타입
interface CompositeJobCandidate {
  name: string;
  bonus: { [key: string]: number }; // Decimal 대신 일반 숫자로 가정
}

interface PrestigeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCompositeJob: (job: CompositeJobCandidate) => void;
}

const PrestigeModal: React.FC<PrestigeModalProps> = ({ isOpen, onClose, onSelectCompositeJob }) => {
  const { state } = useGame();
  const [candidates, setCandidates] = React.useState<CompositeJobCandidate[]>([]);
  const [loading, setLoading] = React.useState(false);

  // TODO: 실제 job, title, archetype 데이터를 가져오는 로직 구현 필요
  const mockJob: Job = { id: 'diligent', name: '전사', tags: ['battle'], description: '용맹한 전사', bonuses: [], perspectivePrompt: "용맹한 전사입니다." };
  const mockTitle: Title = { id: 'researchGeek', tags: ['lab'], label: '연구광', description: '연구를 좋아하는 사람', tier: 0, unlocked: true, path: 'research', baseXPToNextLevel: new Decimal(100), famePerSecBonus: new Decimal(0.01), level: 0, xp: new Decimal(0) };
  const mockArchetype: ArchetypeVector = state.archetype || { orderChaos: 0, altruismSelf: 0, asceticHedon: 0, knowledgeDestruction: 0 }; // 실제 성향 벡터 사용

  React.useEffect(() => {
    if (isOpen && state.feature.newJobSystem) {
      const generateCompositeJob = httpsCallable(appFunctions, 'genComposite');
      setLoading(true);
      generateCompositeJob({ job: mockJob, title: mockTitle, archetype: mockArchetype })
        .then((result: any) => {
          setCandidates(result.data.candidates);
        })
        .catch(error => {
          console.error("Error generating composite jobs:", error);
          setCandidates([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, state.feature.newJobSystem, mockArchetype]);

  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>새로운 파생 직업 선택</AlertDialogTitle>
          <AlertDialogDescription>
            AI가 당신의 직업, 칭호, 성향을 분석하여 새로운 파생 직업 후보를 추천합니다. 하나를 선택하세요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {loading ? (
            <div>생성 중...</div>
          ) : candidates.length > 0 ? (
            candidates.map((candidate, index) => (
              <div key={index} className="border p-4 rounded-md shadow-sm">
                <h3 className="text-lg font-bold">{candidate.name}</h3>
                <ul className="text-sm text-muted-foreground mt-2">
                  {Object.entries(candidate.bonus).map(([key, value]) => (
                    <li key={key}>{key}: +{(value * 100).toFixed(1)}%</li>
                  ))}
                </ul>
                <Button onClick={() => onSelectCompositeJob(candidate)} className="mt-4 w-full">
                  선택
                </Button>
              </div>
            ))
          ) : (
            <div>후보를 불러올 수 없습니다.</div>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>취소</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PrestigeModal;

