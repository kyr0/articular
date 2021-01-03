import { LFOOptions as ToneLFOOptions } from 'tone';

export interface LFOOptions extends Partial<ToneLFOOptions> {
    frequency?: number;
    min?: number;
    max?: number;
}
