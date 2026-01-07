import { useGame, getTitleUnlockCost, getTitleUpgradeCost } from "@/app/providers/GameProvider";
import { Title } from "../types/title"; // Title 타입 임포트
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import Decimal from "break_infinity.js";

interface TitleDialogProps {
  node: Title | null; // 선택 노드 (null = 닫힘)
  onClose: () => void;
}

/**
 * 전직·강화 다이얼로그
 * - 잠금 상태면 해금 조건 표시 (Fame, Title XP, Achievements, Prestige)
 * - 해금 가능 시 "전직" 버튼, 이미 해금이면 "강화" 버튼
 * - 강화 비용/레벨 조건은 외부 util 사용
 */
export default function TitleDialog({ node, onClose }: TitleDialogProps) {
  const { state: { fame, titles }, actions: { unlockTitle, upgradeTitle } } = useGame();
  const currentTitleLevel: number = node ? (titles[node.id]?.level ?? -1) : -1; // 현재 칭호 레벨 가져오기

  const unlockCostValue = node ? getTitleUnlockCost(node.tier) : new Decimal(0);
  const upgradeCostValue = node ? getTitleUpgradeCost(node.tier, currentTitleLevel + 1) : new Decimal(0);

  const canUnlock = node && currentTitleLevel === -1 && fame.gte(unlockCostValue);
  const canUpgrade = node && currentTitleLevel >= 0 && fame.gte(upgradeCostValue);

  if (!node) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          key="dialog"
          className="bg-neutral-800 rounded-xl p-6 w-80 text-white shadow-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <h2 className="text-lg font-semibold mb-4 text-center">
            {node.label}
          </h2>

          {currentTitleLevel >= 0 ? (
            <>
              <p className="text-sm text-gray-400 mb-2">강화 레벨: {currentTitleLevel}</p>
              <p className="text-sm text-gray-400 mb-4">다음 강화 비용: {upgradeCostValue.toString()} Fame</p>
            </>
          ) : (
            <p className="text-sm text-gray-400 mb-4">
              전직 비용: {unlockCostValue.toString()} Fame
            </p>
          )}

          <div className="flex gap-2 mt-2">
            <Button variant="secondary" className="flex-1" onClick={onClose}>
              닫기
            </Button>
            {canUnlock && (
              <Button className="flex-1" onClick={() => handleUnlock(node)}>
                전직
              </Button>
            )}
            {canUpgrade && (
              <Button className="flex-1" onClick={() => handleUpgrade(node)}>
                강화
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  function handleUnlock(n: Title) {
    unlockTitle(n.id, n.tier);
    onClose();
  }

  function handleUpgrade(n: Title) {
    upgradeTitle(n.id, n.tier, currentTitleLevel);
  }
}
