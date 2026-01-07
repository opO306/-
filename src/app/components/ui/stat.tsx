import * as React from "react";
import { cn } from "./utils";

interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
}

const Stat = React.forwardRef<HTMLDivElement, StatProps>(
  ({ className, label, value, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col items-start", className)} {...props}>
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-2xl font-bold font-mono">{value}</span>
    </div>
  )
);
Stat.displayName = "Stat";

interface StatSubProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const StatSub = React.forwardRef<HTMLDivElement, StatSubProps>(
  ({ className, value, ...props }, ref) => (
    <div ref={ref} className={cn("text-xs text-slate-400", className)} {...props}>
      {value}
    </div>
  )
);
StatSub.displayName = "StatSub";

export { Stat, StatSub };

