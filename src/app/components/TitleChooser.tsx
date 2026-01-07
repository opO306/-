import { useVisibleTitles } from "../../hooks/useVisibleTitles";
import { Title } from "../../types/title";

interface TitleNode extends Title {}

function TitleChooser({
  allTitles,
  currentTitleId,
  onSelectNext,
}: {
  allTitles: TitleNode[];
  currentTitleId: string | null;
  onSelectNext: (id: string) => void;
}) {
  const nextList = useVisibleTitles(allTitles, currentTitleId);

  return (
    <section className="space-y-4">
      {/* 현재 칭호 (있으면) */}
      {currentTitleId && (
        <CurrentBadge node={allTitles.find(t => t.id === currentTitleId)!} />
      )}

      {/* 승급 후보 */}
      <ul className="grid grid-cols-2 gap-3 place-items-center">
        {nextList.map((n) => (
          <li key={n.id}>
            <button
              onClick={() => onSelectNext(n.id)}
              disabled={!n.unlocked}
              className={`w-32 rounded-xl py-2 text-sm transition
                         ${n.unlocked
                           ? 'bg-white shadow hover:bg-blue-50'
                           : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                         ${currentTitleId === n.id ? 'ring-2 ring-blue-500' : ''}`}>
              {n.label}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

const CurrentBadge = ({ node }: { node: TitleNode }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs text-slate-500">현재 칭호</span>
    <span className="rounded-full bg-blue-600 text-white px-3 py-1 text-sm">
      {node.label}
    </span>
  </div>
);

export default TitleChooser;
