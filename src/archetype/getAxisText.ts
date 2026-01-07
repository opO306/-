import { AxisDescriptor } from "./types";

export function getAxisText(
  value: number,
  descriptors: AxisDescriptor[]
): string {
  const found = descriptors.find(
    (d) => value >= d.range[0] && value <= d.range[1]
  );

  return found?.text ?? "알 수 없는 성향";
}
