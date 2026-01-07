export function SituationResult({
  text,
  onContinue,
  showJobSuggestionButtons = false, // 새로운 props
  onAcceptJob,
  onDeclineJob,
  suggestedJobName,
}: {
  text: string;
  onContinue: () => void;
  showJobSuggestionButtons?: boolean;
  onAcceptJob?: () => void;
  onDeclineJob?: () => void;
  suggestedJobName?: string;
}) {
  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-10 flex flex-col justify-center">
      <p className="text-gray-700 leading-relaxed mb-12 whitespace-pre-line">
        {text}
      </p>

      {showJobSuggestionButtons && suggestedJobName && onAcceptJob && onDeclineJob ? (
        <div className="flex gap-3">
          <button
            onClick={onAcceptJob}
            className="flex-1 rounded-2xl border bg-white py-4 text-sm text-gray-600 active:scale-[0.98]"
          >
            [ {suggestedJobName} ]으로 받아들인다
          </button>
          <button
            onClick={onDeclineJob}
            className="flex-1 rounded-2xl border bg-white py-4 text-sm text-gray-600 active:scale-[0.98]"
          >
            [ 지금은 아니다 ]
          </button>
        </div>
      ) : (
        <button
          onClick={onContinue}
          className="w-full rounded-2xl border bg-white py-4 text-sm text-gray-600 active:scale-[0.98]"
        >
          계속
        </button>
      )}
    </main>
  );
}

