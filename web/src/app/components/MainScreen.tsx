import React, { useState, useEffect } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { buildRebirthPrompt, buildProfilePrompt } from '../../game/ai/prompt'; // buildProfilePrompt 임포트
import { callRebirthAI, callProfileAI } from '../../game/ai/callOpenAI';     // callProfileAI 임포트
import { saveRebirthToFirestore } from '../../game/db/saveRebirth';
import RebirthResult from '../screens/RebirthResult'; // RebirthResult 컴포넌트 임포트

const MainScreen: React.FC = () => {
    const { gameState, onChoice, resetGameState, getJobTitle, dispatch } = useGameState(); // dispatch 추가
    const [rebirthResult, setRebirthResult] = useState<null | {
        title: string;
        summary: string;
        profileType: string;
        profileSummary: string;
    }>(null);
    const [isRebirthing, setIsRebirthing] = useState(false);
    const [jobTitle, setJobTitle] = useState<string>(''); // jobTitle 상태 추가

    // jobTitle 로드 (컴포넌트 마운트 시 및 gameState.baseJob 변경 시)
    useEffect(() => {
        const loadJobTitle = async () => {
            const title = await getJobTitle();
            setJobTitle(title);
        };
        loadJobTitle();
    }, [getJobTitle, gameState.baseJob]); // getJobTitle과 gameState.baseJob을 의존성 배열에 추가

    // 임시 데이터 (실제 게임 상태와 연동되어야 함)
    const npcMemory = [
        "People tend to avoid making promises around you.",
        "Your presence makes others uneasy.",
    ];
    const eventBias = {
        conflict: 60,
        cooperation: 40,
        avoidance: 20,
    };

    // 선택 비율 계산기
    function getRate(type: "Help" | "Take_Advantage" | "Betray") { // ChoiceLog의 type 필드와 일치하도록 수정
        const total = gameState.logs.choices.length;
        const count = gameState.logs.choices.filter((c) => c.type === type).length; // c.choice 대신 c.type 사용
        return total === 0 ? 0 : Math.round((count / total) * 100);
    }

    async function onRebirth() {
        setIsRebirthing(true);

        const prompt = buildRebirthPrompt(gameState);
        const aiResult = await callRebirthAI(prompt);

        const profilePrompt = buildProfilePrompt({
            total: gameState.logs.choices.length,
            helpRate: getRate("Help"),
            profitRate: getRate("Take_Advantage"), // "Profit" 대신 "Take_Advantage" 사용
            betrayRate: getRate("Betray"),
        });
        const profileResult = await callProfileAI(profilePrompt);

        // 🔐 예시용 임시 UID (실제 로그인 연동 필요)
        const mockUid = "test-user";
        await saveRebirthToFirestore(mockUid, gameState, aiResult); // Firestore에 저장

        setRebirthResult({
            title: aiResult.title,
            summary: aiResult.summary,
            profileType: profileResult.profileType,
            profileSummary: profileResult.profileSummary,
        });

        dispatch({ type: "REBIRTH", baseJob: gameState.baseJob, title: aiResult.title }); // title 추가
        setIsRebirthing(false);
    }

    if (rebirthResult) {
        return (
            <RebirthResult
                title={rebirthResult.title}
                summary={rebirthResult.summary}
                profileType={rebirthResult.profileType}
                profileSummary={rebirthResult.profileSummary}
                onNext={() => {
                    setRebirthResult(null);
                    resetGameState(); // 게임 상태 초기화
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <h1 className="text-3xl font-bold mb-6 mt-4">Rebirth Simulation</h1>

            {/* Main Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mb-6">
                {/* Profile Section */}
                <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-300 rounded-full mr-4"></div> {/* Placeholder for image */}
                    <div>
                        <h2 className="text-xl font-semibold">{jobTitle || 'Loading Job Title...'}</h2> {/* jobTitle 사용 */}
                        <div className="flex items-center text-sm text-gray-700">
                            <span className="flex items-center mr-3">
                                <span className="mr-1">❗</span> Notorious
                            </span>
                            <span className="flex items-center mr-3">
                                <span className="mr-1">⚔️</span> Strength {gameState.strength}
                            </span>
                            <span className="flex items-center">
                                <span className="mr-1">💰</span> Wealth {gameState.gold.toString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* AI Dialog */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold mb-2">AI Dialog</h3>
                    <p className="text-gray-800">
                        The villagers fall silent as you approach, their eyes lowered. The elder
                        speaks hesitantly, measuring his words with care. There's a tense air,
                        waiting for your next move...
                    </p>
                </div>

                {/* Response Options */}
                <h3 className="font-semibold mb-3 text-center">How will you respond?</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                        onClick={() => onChoice("Help")}
                        className="bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Silently offer your help
                    </button>
                    <button
                        onClick={() => onChoice("Take_Advantage")}
                        className="bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
                    >
                        Demand their obedience
                    </button>
                    <button
                        onClick={() => onChoice("Take_Advantage")}
                        className="bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
                    >
                        Take a share of the profits
                    </button>
                    <button
                        onClick={() => onChoice("Betray")}
                        className="bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
                    >
                        Walk away without a word
                    </button>
                </div>
            </div>

            {/* NPC Memory & Event Bias Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md mb-6">
                <div className="bg-white rounded-xl shadow-lg p-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                        <span className="mr-2">🧠</span> NPC Memory
                    </h3>
                    <ul className="list-disc pl-5 text-gray-700 text-sm">
                        {npcMemory.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                        <span className="mr-2">📈</span> Event Bias
                    </h3>
                    <div className="space-y-2">
                        <div>
                            <p className="text-sm text-gray-700">Conflict</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${eventBias.conflict}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-700">Cooperation</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${eventBias.cooperation}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-700">Avoidance</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-gray-500 h-2 rounded-full" style={{ width: `${eventBias.avoidance}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Auto-progress & Continue Button */}
            <div className="flex items-center justify-between w-full max-w-md mb-6">
                <div className="flex items-center">
                    <input type="checkbox" id="autoProgress" className="mr-2" />
                    <label htmlFor="autoProgress" className="text-gray-700">Auto-progress</label>
                </div>
                <button
                    onClick={onRebirth}
                    disabled={isRebirthing}
                    className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                >
                    {isRebirthing ? "CONTINUING..." : "CONTINUE"}
                </button>
            </div>
        </div>
    );
};

export default MainScreen;
