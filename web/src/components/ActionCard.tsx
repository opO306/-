
export function ActionCard({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="rounded-2xl bg-white p-5 text-left shadow-sm transition active:scale-[0.98]">
      <div className="text-lg font-medium">{title}</div>
      <div className="mt-1 text-sm text-gray-500">{description}</div>
    </button>
  );
}
