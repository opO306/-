
export default function RebirthResult(props: {
  title: string;
  summary: string;
  profileType: string;
  profileSummary: string;
  onNext: () => void;
}) {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h2>⚰️ 한 생의 끝</h2>

      <div style={{ marginBottom: '16px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
        <strong>🏷️ 칭호: {props.title}</strong>
        <p style={{ fontSize: '14px', marginTop: '5px' }}>{props.summary}</p>
      </div>

      <div style={{ marginBottom: '16px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
        <strong>🧠 성향: {props.profileType}</strong>
        <p style={{ fontSize: '14px', marginTop: '5px' }}>{props.profileSummary}</p>
      </div>

      <button onClick={props.onNext}
        style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        다음 생으로
      </button>
    </div>
  );
}
