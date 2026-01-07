export function worldFlagsToTone(flags: string[]) {
  const tones: string[] = [];

  if (flags.includes("observer_world")) {
    tones.push("상황은 관찰과 기록의 의미를 띤다");
  }
  if (flags.includes("unstable_world")) {
    tones.push("상황은 이전보다 불안정하다");
  }
  if (flags.includes("curious_world")) {
    tones.push("상황은 미해결된 단서가 많다");
  }

  return tones;
}

