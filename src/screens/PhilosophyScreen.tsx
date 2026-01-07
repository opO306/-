/**
 * Game Philosophy Screen - 게임 철학 상세 화면
 * 게임의 핵심 시스템과 차별점을 자세히 설명
 */

export default function PhilosophyScreen({ onBack }: { onBack: () => void }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-24">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="px-5 py-4">
          <button onClick={onBack} className="text-white/80 hover:text-white">
            ← 돌아가기
          </button>
        </div>
      </div>

      <div className="px-5 pt-6 space-y-6 max-w-2xl mx-auto">
        {/* 제목 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            게임 철학
          </h1>
          <p className="text-gray-300">
            이 게임을 특별하게 만드는 설계 원칙들
          </p>
        </div>

        {/* 섹션 1: 능력치 없음 */}
        <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🎭</span>
            <div>
              <h2 className="text-xl font-bold text-white">능력치가 없는 세계</h2>
              <p className="text-sm text-gray-400">변화하는 정체성</p>
            </div>
          </div>
          
          <div className="space-y-3 text-gray-300 text-sm">
            <p>
              전통적인 RPG와 달리, 이 게임에는 <strong className="text-purple-400">레벨, 스탯, 공격력</strong> 같은 
              수치가 존재하지 않습니다.
            </p>
            <p>
              대신 당신의 선택은 <strong className="text-purple-400">칭호</strong>로 기록되며, 
              이는 단순히 더 강해지는 것이 아니라 <strong className="text-purple-400">다른 존재가 되어가는</strong> 과정입니다.
            </p>
            <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
              <p className="text-xs text-purple-200">
                💡 <strong>예시:</strong> "시민" → "관찰자" → "시간의 방랑자"<br />
                각 칭호는 능력이 아닌 정체성의 변화를 나타냅니다.
              </p>
            </div>
          </div>
        </section>

        {/* 섹션 2: 정답 없음 */}
        <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🌿</span>
            <div>
              <h2 className="text-xl font-bold text-white">정답이 없는 선택</h2>
              <p className="text-sm text-gray-400">모든 길은 유효합니다</p>
            </div>
          </div>
          
          <div className="space-y-3 text-gray-300 text-sm">
            <p>
              게임 내 어떤 선택도 <strong className="text-green-400">"옳거나"</strong> 
              <strong className="text-red-400">"틀리지"</strong> 않습니다.
            </p>
            <p>
              각 선택은 다른 칭호와 이야기로 이어지며, 그것은 단지 <strong className="text-green-400">다른 플레이</strong>일 뿐입니다.
            </p>
            <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
              <p className="text-xs text-green-200">
                ⚖️ <strong>중요:</strong> "선한" 플레이도, "악한" 플레이도 없습니다.
                오직 당신만의 이야기가 있을 뿐입니다.
              </p>
            </div>
          </div>
        </section>

        {/* 섹션 3: 반복 플레이 */}
        <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">♾️</span>
            <div>
              <h2 className="text-xl font-bold text-white">반복되는 환생</h2>
              <p className="text-sm text-gray-400">끝은 새로운 시작</p>
            </div>
          </div>
          
          <div className="space-y-3 text-gray-300 text-sm">
            <p>
              한 번의 플레이로 <strong className="text-orange-400">모든 것을 볼 수 없습니다</strong>.
              이는 버그가 아니라 의도된 설계입니다.
            </p>
            <p>
              환생을 통해 새로운 칭호와 이야기를 발견하며, 
              <strong className="text-orange-400">매번 다른 정체성</strong>으로 세계를 경험합니다.
            </p>
            <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
              <p className="text-xs text-orange-200">
                🔄 <strong>환생 시스템:</strong> 진행도가 100%에 도달하면 환생할 수 있으며,
                새로운 칭호 조합을 탐험할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 섹션 4: 칭호 합성 */}
        <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">⚗️</span>
            <div>
              <h2 className="text-xl font-bold text-white">칭호 합성</h2>
              <p className="text-sm text-gray-400">창조와 발견</p>
            </div>
          </div>
          
          <div className="space-y-3 text-gray-300 text-sm">
            <p>
              여러 칭호를 <strong className="text-pink-400">합성</strong>하여 
              완전히 새로운 칭호를 만들 수 있습니다.
            </p>
            <p>
              예상치 못한 조합이 독특한 결과를 낳으며, 
              직접 칭호를 <strong className="text-pink-400">제안</strong>하여 게임에 기여할 수도 있습니다.
            </p>
            <div className="bg-pink-500/10 rounded-lg p-3 border border-pink-500/20">
              <p className="text-xs text-pink-200">
                ✨ <strong>UGC 시스템:</strong> 제안된 칭호는 검토 후 게임에 추가되며,
                다른 플레이어들도 사용할 수 있게 됩니다.
              </p>
            </div>
          </div>
        </section>

        {/* 섹션 5: AI 옵션 */}
        <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🎲</span>
            <div>
              <h2 className="text-xl font-bold text-white">AI가 없어도 괜찮아요</h2>
              <p className="text-sm text-gray-400">선택적 강화</p>
            </div>
          </div>
          
          <div className="space-y-3 text-gray-300 text-sm">
            <p>
              AI는 이야기를 <strong className="text-blue-400">더 풍부하게</strong> 만들지만 
              <strong className="text-blue-400">필수는 아닙니다</strong>.
            </p>
            <p>
              AI가 없어도 사전 준비된 콘텐츠로 완전한 플레이가 가능하며,
              당신의 경험은 언제나 보장됩니다.
            </p>
            <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
              <p className="text-xs text-blue-200">
                🤖 <strong>Fallback 시스템:</strong> AI 사용 불가 시 자동으로
                사전 제작된 고품질 콘텐츠로 전환됩니다.
              </p>
            </div>
          </div>
        </section>

        {/* 섹션 6: 업적 시스템 */}
        <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🏆</span>
            <div>
              <h2 className="text-xl font-bold text-white">칭호 기반 업적</h2>
              <p className="text-sm text-gray-400">자동 생성 콘텐츠</p>
            </div>
          </div>
          
          <div className="space-y-3 text-gray-300 text-sm">
            <p>
              모든 칭호는 자동으로 <strong className="text-yellow-400">관련 업적</strong>을 생성합니다.
            </p>
            <p>
              칭호를 해금하거나 특정 레벨까지 강화하면 업적이 달성되며,
              이는 당신의 여정을 기록하는 또 다른 방법입니다.
            </p>
          </div>
        </section>

        {/* 마무리 */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-500/20 text-center">
          <p className="text-white text-lg font-semibold mb-2">
            🌟 이 게임은 당신의 이야기입니다
          </p>
          <p className="text-gray-300 text-sm">
            강해지는 것이 아니라, 변화하는 것.<br />
            정답을 찾는 것이 아니라, 경험하는 것.<br />
            한 번에 끝내는 것이 아니라, 계속 발견하는 것.
          </p>
        </div>
      </div>
    </main>
  );
}
