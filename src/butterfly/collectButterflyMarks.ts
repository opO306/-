import {
  BUTTERFLY_MARK_RULES,
  MarkTriggerContext,
} from "./markRules";
import { ButterflyMark } from "@/types/butterfly";

export function collectButterflyMarks(
  ctx: MarkTriggerContext
): ButterflyMark[] {
  const marks: ButterflyMark[] = [];

  for (const rule of BUTTERFLY_MARK_RULES) {
    if (rule.when(ctx)) {
      marks.push(rule.create());
    }
  }

  return marks;
}

