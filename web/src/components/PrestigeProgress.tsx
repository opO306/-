
export function PrestigeProgress({
  progress,
  message,
}: {
  progress: number; // 0-100 사이의 숫자
  message: string;
}) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-600">환생까지</span>
        <span className="font-medium">{progress}%</span>
      </div>

      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full bg-accent"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-2 text-xs text-gray-400">
        {message}
      </div>
    </section>
  );
}
