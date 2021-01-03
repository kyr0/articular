import { FilterOptions } from 'tone';
import { FilterType } from './FilterType';
import { Rolloff } from './Rolloff';

export interface MasterFilterOptions extends Partial<FilterOptions> {
    enabled?: boolean;
    enableKeyTracking?: boolean;
    detune?: number; // cents
    cutoff?: number; // hz
    type?: FilterType;
    drive?: number; // gain
    resonance?: number; // Q factor
    rolloff?: Rolloff;
    volume: number; // mix
}
