export function fallbackSituationText() {
  const pool = [
    "주변은 조용하다.\n아직 뚜렷한 변화는 보이지 않는다.",
    "상황은 멈춰 있는 것처럼 보인다.\n그러나 완전히 끝난 것은 아니다.",
    "특별한 사건은 없지만,\n무언가 이어지고 있는 느낌이 든다.",
  ];

  return pool[Math.floor(Math.random() * pool.length)];
}

