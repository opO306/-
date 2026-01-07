import { WorldContext } from "@/butterfly/buildWorldContext";

export function buildSituationOptions(
  constraint: "safe" | "risk" | "extreme",
  worldContext: WorldContext
) {
  const options = [];

  options.push({ id: "observe", label: "관찰한다" });

  if (constraint !== "safe") {
    options.push({ id: "intervene", label: "개입한다" });
  }

  if (
    constraint === "extreme" ||
    worldContext.optionDistortion.length > 0
  ) {
    options.push({ id: "distort", label: "왜곡한다" });
  }

  return options;
}

