import { motion } from "framer-motion";

/**
 * AlignmentGauge – 선(😇) / 중립(😐) / 악(😈) 단일 축 게이지
 *
 * Props:
 *  - value: number  // -100 ~ +100
 *
 * 사용 예:
 * <AlignmentGauge value={alignment} />
 */
interface AlignmentGaugeProps {
  value: number; // -100 ~ 100
  size?: "sm" | "md" | "lg";
}

export default function AlignmentGauge({ value, size = "md" }: AlignmentGaugeProps) {
  const clamped = Math.max(-100, Math.min(100, value));
  const percent = (clamped + 100) / 2; // 0 ~ 100
  const height = size === "sm" ? 8 : size === "lg" ? 16 : 12;

  return (
    <div className="w-full flex flex-col gap-1">
      <div
        className="relative w-full rounded-full bg-gradient-to-r from-purple-700 via-gray-700 to-amber-400 shadow-inner"
        style={{ height }}
      >
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full bg-white/80"
          initial={{ width: `${percent}%` }}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
        {/* Center marker */}
        <div
          className="absolute top-0 left-1/2 w-0.5 h-full bg-white/30"
          style={{ transform: "translateX(-50%)" }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 px-1">
        <span>😈 악</span>
        <span>😐 중립</span>
        <span>😇 선</span>
      </div>
    </div>
  );
}

