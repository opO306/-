export function StatusBar({
  job,
  identity
}: {
  job: string;
  identity: string;
}) {
  const labelMap: Record<string, string> = {
    Honorable: "기사",
    Questioned: "의심받는 기사",
    Dishonored: "명예를 잃은 기사",
    Infamous: "타락한 기사",
    Unrecognized: "전직 기사"
  };

  return (
    <div>
      <strong>{labelMap[identity]}</strong>
    </div>
  );
}

