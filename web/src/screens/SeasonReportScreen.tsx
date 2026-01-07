interface SeasonReportScreenProps {
  text: string;
  onClose: () => void;
}

export function SeasonReportScreen({ text, onClose }: SeasonReportScreenProps) {
  return (
    <div style={{ flex: 1, padding: 28, justifyContent: "center" }}>
      <p style={{
        fontSize: 15,
        lineHeight: 26,
        color: "#111",
        marginBottom: 40
      }}>
        {text}
      </p>

      <button onClick={onClose} style={{ alignSelf: "center" }}>
        <p style={{ fontSize: 14, color: "#666" }}>계속</p>
      </button>
    </div>
  );
}
