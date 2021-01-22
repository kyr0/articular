import { List } from 'immutable';

// Calculate a single sample for the combined curve of a number of partials.
export const sumSineWaves = (partials: List<List<number>>, sampleNumber: number, gain: number): number => {
    // sum up the values of all the sine waves for this particular sample.
    const sum = partials.map((p: List<number>) => p.get(sampleNumber)).reduce((sum, s) => sum + (s || 0), 0);
    // apply master gain to the sum.
    const sample = sum * gain;
    // clamp to [-1..1]
    return Math.min(1, Math.max(-1, sample));
};
