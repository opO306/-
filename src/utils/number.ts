import Decimal from "break_infinity.js";

export function fmt(num: Decimal) {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(num.toNumber());
}

export const bigNum = "text-6xl md:text-7xl font-extrabold";