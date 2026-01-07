export function suggestInitialJob(choiceId: string) {
  if (choiceId === "observe") return "researcher";
  if (choiceId === "intervene") return "guardian";
  return null;
}

