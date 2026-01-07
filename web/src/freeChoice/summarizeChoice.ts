export function summarize(text: string): string {
  if (text.length < 20) return text;
  return text.slice(0, 20) + "...";
}

