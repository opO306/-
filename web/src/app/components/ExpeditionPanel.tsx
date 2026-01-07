import { useGame } from "@/app/providers/GameProvider";
import { EXPEDITIONS } from "../../data/expeditions";
import { motion, AnimatePresence } from "framer-motion";
import { OngoingExpedition } from "../providers/GameProvider";
import { ExpeditionDef } from "../../data/expeditions";

interface ExpeditionPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function ExpeditionPanel({ open, onClose }: ExpeditionPanelProps) {
  const { state, dispatch } = useGame();
  // analyzePlayerIntent와 generateGameSituation은 ExpeditionPanel에서 사용되지 않으므로 무시합니다.
  const { fame, expeditions } = state;

  const activeIds = expeditions.map((e: OngoingExpedition) => e.id);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="card rounded-xl p-6 w-96 max-w-full shadow-xl overflow-y-auto max-h-[90vh]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-lg font-semibold mb-4 text-center">탐험</h2>

            {/* 진행 중 */}
            {expeditions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">진행 중</h3>
                {expeditions.map((e: OngoingExpedition) => (
                  <ActiveCard key={e.id} id={e.id} end={e.end} />
                ))}
              </div>
            )}

            {/* 모든 탐험 목록 */}
            <h3 className="text-sm font-medium mb-2">탐험 선택</h3>
            <div className="flex flex-col gap-3">
              {EXPEDITIONS.map((exp: ExpeditionDef) => {
                const canAfford = fame.gte(exp.fameCost);
                const ongoing = activeIds.includes(exp.id);
                return (
                  <div className="card flex justify-between items-center">
                    <div>
                      <p className="font-medium">{exp.label}</p>
                      <p className="text-xs text-[var(--gray-6)]">
                        {msToMin(exp.duration)}분 • +{exp.fameRewardPct * 100}% • Δ{exp.alignmentDelta}
                      </p>
                    </div>

                    <button
                      disabled={!canAfford || ongoing}
                      className={`btn ${canAfford && !ongoing ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => dispatch({ type: "START_EXPEDITION", id: exp.id })}
                    >
                      {ongoing ? '진행 중' : '시작'}
                    </button>
                  </div>
                );
              })}
            </div>

            <button className="btn btn-ghost mt-6 w-full" onClick={onClose}>
              닫기
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  function msToMin(ms: number) {
    return Math.round(ms / 60000);
  }
}

function ActiveCard({ id, end }: { id: string; end: number }) {
  const { label } = EXPEDITIONS.find((e: ExpeditionDef) => e.id === id)!;
  const remain = Math.max(0, end - Date.now());
  const min = Math.floor(remain / 60000);
  const sec = Math.floor((remain % 60000) / 1000);
  return (
    <div className="text-xs text-[var(--gray-6)] flex justify-between items-center">
      <span>{label}</span>
      <span>{min}:{sec.toString().padStart(2, "0")}</span>
    </div>
  );
}
