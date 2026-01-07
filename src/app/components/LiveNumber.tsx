import React from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import Decimal from "break_infinity.js";
import { fmt } from "@/utils/number";

interface LiveNumberProps {
  value: Decimal;
  unit: string;
}

export default function LiveNumber({ value, unit }: LiveNumberProps) {
  const springValue = useSpring(0, { stiffness: 100, damping: 30 }); // fame 값의 애니메이션을 위한 spring
  const displayValue = useTransform(springValue, (latest) => fmt(new Decimal(latest)) + unit);

  // value가 변경될 때마다 spring 값을 업데이트
  React.useEffect(() => {
    springValue.set(value.toNumber());
  }, [value, springValue]);

  return <motion.p className="text-3xl font-bold font-mono text-center">{displayValue}</motion.p>;
}

