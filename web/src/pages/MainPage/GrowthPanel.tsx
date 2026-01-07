/**
 * src/pages/MainPage/GrowthPanel.tsx
 * 메인 성장 패널: 명성(Fame)과 성향(Alignment) 표시
 */
import { useGame } from '../../app/providers/GameProvider';

export function GrowthPanel() {
  const { state } = useGame();

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      {/* 메인 타이틀/직업 표시 (Optional) */}
      <div className="text-center">
         <div className="text-sm text-slate-500 mb-1">현재 상태</div>
         <div className="text-2xl font-bold text-white">
            {state.currentJobId ? state.currentJobId.toUpperCase() : "방랑자"}
         </div>
      </div>

      {/* 성장 수치 (명성) */}
      <div className="flex gap-12">
        <StatItem
          label="명성 (Fame)"
          value={formatDecimal(state.fame)}
          description="현재 보유량"
          highlight
        />
        <StatItem
          label="증가량"
          value={`+${formatDecimal(state.famePerSec)}/s`}
          description="초당 명성 획득"
        />
      </div>
      
      {/* 보조 정보: 성향 */}
      <div className="text-center space-y-2">
         <div className="text-xs text-slate-500">성향 (Alignment)</div>
         <div className="w-48 h-2 bg-slate-700 rounded-full overflow-hidden mx-auto relative">
            {/* 중앙 기준선 */}
            <div className="absolute left-1/2 top-0 w-px h-full bg-slate-500/50" />
            <div 
               className={`h-full transition-all duration-500 ${state.alignment >= 0 ? 'bg-blue-500 ml-auto mr-1/2' : 'bg-red-500 mr-auto ml-1/2'}`}
               style={{ 
                 width: `${Math.abs(state.alignment) / 2}%`, // 100~-100 범위를 절반씩
                 marginLeft: state.alignment >= 0 ? '50%' : undefined,
                 marginRight: state.alignment < 0 ? '50%' : undefined,
                 // 단순화를 위해 transform 사용이 나을 수 있음:
                 transformOrigin: state.alignment >= 0 ? 'left' : 'right',
                 // (CSS로 게이지 바 구현은 복잡하므로 단순 수치로 대체 가능)
               }}
            />
         </div>
         <div className="text-sm font-medium text-slate-300">
            {state.alignment.toFixed(1)} 
            <span className="text-xs text-slate-500 ml-1">
               ({state.alignment > 0 ? "질서/선" : state.alignment < 0 ? "혼돈/악" : "중립"})
            </span>
         </div>
      </div>
    </div>
  );
}

interface StatItemProps {
  label: string;
  value: string;
  description: string;
  highlight?: boolean;
}

function StatItem({ label, value, description, highlight }: StatItemProps) {
  return (
    <div className="text-center">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className={`text-4xl font-bold ${highlight ? 'text-yellow-400' : 'text-slate-300'}`}>
        {value}
      </div>
      <div className="text-xs text-slate-600 mt-1">{description}</div>
    </div>
  );
}

// Decimal 포맷팅 헬퍼
function formatDecimal(decimal: any): string {
  if (!decimal) return "0";
  // break_infinity.js 객체라고 가정
  const d = decimal; 
  if (d.gte(1000000)) return d.toExponential(2);
  if (d.gte(1000)) return d.toFixed(1);
  return d.toFixed(1);
}
