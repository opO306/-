interface RebirthResult {
  summary: string;
  title: string;
}

interface ProfileResult {
  profileType: string;
  profileSummary: string;
}

export async function callRebirthAI(prompt: string): Promise<RebirthResult> {
  console.log("OpenAI API 호출 시뮬레이션 - 프롬프트:", prompt);

  // 실제 OpenAI API 호출 코드는 여기에 들어갑니다.
  // const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  //   },
  //   body: JSON.stringify({
  //     model: "gpt-3.5-turbo", // 또는 다른 모델
  //     messages: [{ role: "user", content: prompt }],
  //     max_tokens: 100,
  //   }),
  // });
  // const data = await response.json();
  // return JSON.parse(data.choices[0].message.content);

  // 현재는 Mock 데이터 반환
  await new Promise(resolve => setTimeout(resolve, 1500)); // API 호출 지연 시뮬레이션

  const mockResults = [
    { summary: "명예를 버리고도 검을 놓지 않았다.", title: "타락검귀" },
    { summary: "평범한 삶을 살다 조용히 사라졌다.", title: "무명인" },
    { summary: "지식을 탐하다 세상을 등졌다.", title: "은둔학자" },
    { summary: "시민으로서 평화로운 삶을 살았다.", title: "평온한 시민" },
    { summary: "수많은 배신 끝에 홀로 남았다.", title: "고독한 배신자" },
  ];
  return mockResults[Math.floor(Math.random() * mockResults.length)];
}

export async function callProfileAI(prompt: string): Promise<ProfileResult> {
  console.log("OpenAI API 호출 시뮬레이션 - 프로필 프롬프트:", prompt);

  // 실제 OpenAI API 호출 코드는 여기에 들어갑니다.

  // 현재는 Mock 데이터 반환
  await new Promise(resolve => setTimeout(resolve, 1000)); // API 호출 지연 시뮬레이션

  const mockProfileResults = [
    { profileType: "이타주의자", profileSummary: "다른 이를 돕는 것을 주저하지 않았다." },
    { profileType: "기회주의자", profileSummary: "항상 자신의 이익을 최우선으로 생각했다." },
    { profileType: "악인", profileSummary: "자신의 목적을 위해 타인을 배신하는 데 능숙했다." },
    { profileType: "중립적", profileSummary: "세상사에 크게 관여하지 않고 흘러가는 대로 살았다." },
  ];
  return mockProfileResults[Math.floor(Math.random() * mockProfileResults.length)];
}