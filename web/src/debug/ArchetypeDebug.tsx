// ArchetypeVector 타입은 프로젝트의 archetype 정의에 따라 달라집니다.
// 여기서는 간단히 Record<string, number>로 가정합니다.
type ArchetypeVector = Record<string, number>;

export function ArchetypeDebug({ archetype }: { archetype: ArchetypeVector }) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Archetype</h3>
      {Object.entries(archetype).map(([k, v]) => (
        <div key={k} className="text-sm text-gray-600">
          {k}: {v.toFixed(2)}
        </div>
      ))}
    </div>
  );
}

