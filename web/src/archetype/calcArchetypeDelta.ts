import { ArchetypeVector } from "@/types/archetype";

export type ArchetypeDelta = {
  axis: keyof ArchetypeVector;
  delta: number;
};

export function calcArchetypeDelta(
  before: ArchetypeVector,
  after: ArchetypeVector
): ArchetypeDelta[] {
  return (Object.keys(before) as (keyof ArchetypeVector)[]).map(
    (axis) => ({
      axis,
      delta: after[axis] - before[axis],
    })
  );
}
