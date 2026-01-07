export function TitleFusionConfirmModal({
  inputs,
  resultName,
  onConfirm,
  onCancel,
}: {
  inputs: string[];
  resultName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-6 w-[90%] max-w-sm">
        <h2 className="text-lg font-semibold mb-4">
          칭호 해석
        </h2>

        <div className="space-y-1 text-sm text-gray-600 mb-4">
          {inputs.map((t) => (
            <div key={t}>{t}</div>
          ))}
        </div>

        <div className="text-center text-gray-400 mb-4">↓</div>

        <div className="text-center text-lg font-medium mb-6">
          {resultName}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border py-3 text-sm"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-[#9E7C3A] py-3 text-sm text-white"
          >
            합성
          </button>
        </div>
      </div>
    </div>
  );
}

