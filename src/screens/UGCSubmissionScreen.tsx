/**
 * UGC Title Submission Screen
 * 사용자가 칭호를 제안하고, 승인 상태를 확인할 수 있는 화면
 */
import { useState } from "react";

interface UGCSubmission {
  id: string;
  suggestedName: string;
  status: "pending_review" | "approved" | "rejected";
  createdAt: Date;
  feedback?: string;
}

export default function UGCSubmissionScreen({ onBack }: { onBack: () => void }) {
  const [titleName, setTitleName] = useState("");
  const [submissions, setSubmissions] = useState<UGCSubmission[]>([
    // Mock data - 실제로는 Firebase에서 가져옴
    {
      id: "1",
      suggestedName: "시간의 방랑자",
      status: "approved",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      feedback: "훌륭한 제안입니다! 게임에 추가되었습니다.",
    },
    {
      id: "2",
      suggestedName: "혼돈의 군주",
      status: "pending_review",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    if (titleName.length < 2 || titleName.length > 15) {
      alert("칭호 이름은 2-15자여야 합니다.");
      return;
    }

    setIsSubmitting(true);

    // TODO: Integrate with Firebase Cloud Function - suggestUserTitle(uid, titleName)
    // This will call the backend function (functions/src/ugc/suggestTitle.ts) that:
    // 1. Performs auto-filtering (profanity, length, etc.)
    // 2. Uses AI to infer tags for the title
    // 3. Stores submission in pending_review queue in Firestore
    // 
    // Implementation example:
    // import { httpsCallable } from 'firebase/functions';
    // import { functions } from '@/main';
    // const suggestTitle = httpsCallable<{ name: string }, { success: boolean }>(functions, 'suggestUserTitle');
    // const result = await suggestTitle({ name: titleName });
    // if (!result.data.success) { /* handle error */ }
    
    // Simulated submission for UI demonstration
    setTimeout(() => {
      const newSubmission: UGCSubmission = {
        id: Date.now().toString(),
        suggestedName: titleName,
        status: "pending_review",
        createdAt: new Date(),
      };
      
      setSubmissions([newSubmission, ...submissions]);
      setTitleName("");
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const getStatusInfo = (status: UGCSubmission["status"]) => {
    switch (status) {
      case "pending_review":
        return {
          label: "검토 중",
          color: "bg-yellow-100 text-yellow-700 border-yellow-300",
          icon: "⏳",
        };
      case "approved":
        return {
          label: "승인됨",
          color: "bg-green-100 text-green-700 border-green-300",
          icon: "✓",
        };
      case "rejected":
        return {
          label: "거절됨",
          color: "bg-red-100 text-red-700 border-red-300",
          icon: "✗",
        };
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-5 py-4">
          <div className="flex items-center">
            <button onClick={onBack} className="mr-3 text-gray-600">
              ←
            </button>
            <div>
              <h1 className="text-xl font-semibold">칭호 제안</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                새로운 칭호를 제안하고 게임에 기여하세요
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 성공 알림 */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in">
          ✓ 제안이 제출되었습니다!
        </div>
      )}

      <div className="px-5 pt-4 space-y-6">
        {/* 제출 양식 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h2 className="font-semibold mb-3 text-gray-800">새 칭호 제안</h2>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              칭호 이름 (2-15자)
            </label>
            <input
              type="text"
              value={titleName}
              onChange={(e) => setTitleName(e.target.value)}
              placeholder="예: 시간의 방랑자"
              maxLength={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="text-xs text-gray-400 mt-1 text-right">
              {titleName.length} / 15
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-blue-800 leading-relaxed">
              💡 <strong>제안 가이드:</strong><br />
              • 욕설 및 부적절한 표현 금지<br />
              • 기존 판타지 작품의 직접적인 복사 금지<br />
              • 창의적이고 게임 세계관에 어울리는 이름 권장
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || titleName.length < 2}
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              isSubmitting || titleName.length < 2
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg"
            }`}
          >
            {isSubmitting ? "제출 중..." : "제안 제출"}
          </button>
        </div>

        {/* UGC 승인 파이프라인 설명 */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-200">
          <h3 className="font-semibold mb-3 text-purple-800">
            📋 검토 프로세스
          </h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800">자동 필터링</p>
                <p className="text-xs text-gray-600">
                  욕설, 길이, 중복 등 기본 조건 확인
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800">AI 태그 추론</p>
                <p className="text-xs text-gray-600">
                  제안된 칭호의 성격과 태그 자동 분석
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800">운영팀 검토</p>
                <p className="text-xs text-gray-600">
                  최종 승인 여부 결정 및 피드백 제공
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 내 제안 목록 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h2 className="font-semibold mb-4 text-gray-800">내 제안 목록</h2>
          
          {submissions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-3xl mb-2">📝</div>
              <p className="text-sm">아직 제안한 칭호가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((submission) => {
                const statusInfo = getStatusInfo(submission.status);
                return (
                  <div
                    key={submission.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {submission.suggestedName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {submission.createdAt.toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}
                      >
                        {statusInfo.icon} {statusInfo.label}
                      </span>
                    </div>
                    
                    {submission.feedback && (
                      <div className="mt-3 bg-gray-50 rounded p-3 border-l-4 border-green-400">
                        <p className="text-xs text-gray-700">
                          <strong>피드백:</strong> {submission.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
