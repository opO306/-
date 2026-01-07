export function ChoicePanel({
  onChoose
}: {
  onChoose: (c: "HELP" | "GAIN" | "BETRAY") => void;
}) {
  return (
    <div>
      <button onClick={() => onChoose("HELP")}>돕는다</button>
      <button onClick={() => onChoose("GAIN")}>이익을 취한다</button>
      <button onClick={() => onChoose("BETRAY")}>배신한다</button>
    </div>
  );
}

