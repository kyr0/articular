import { List, Range } from 'immutable';
import { calculateSample } from './calculateSample';

// calculate a number of samples for a sine wave oscillator
export const calculateSineCurve = (
    frequency: number,
    amplitude: number,
    sampleCount: number,
    sampleRate: number,
): List<number> => {
    return (Range(0, sampleCount).map((sampleNumber) =>
        calculateSample(frequency, amplitude, sampleNumber, sampleRate),
    ) as unknown) as List<number>;
};
