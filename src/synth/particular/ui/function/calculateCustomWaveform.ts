import { List, Range } from 'immutable';
import { sumSineWaves } from './sumSineWaves';

export const calculateCustomWaveform = (partials: List<List<number>>, gain: number): List<number> => {
    const sampleCount = (partials.first() as List<number>).size;
    return (Range(0, sampleCount).map((sampleNumber) =>
        sumSineWaves(partials, sampleNumber, gain),
    ) as unknown) as List<number>;
};
