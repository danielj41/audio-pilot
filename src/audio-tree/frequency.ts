export type Frequency = number;

export function stepsToFrequency(initial: Frequency, octaves: number) :
 Frequency {
  return initial * Math.pow(2, octaves);
}
