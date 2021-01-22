import { LFOOptions as ToneLFOOptions } from 'tone';

export interface LFOOptions extends Partial<ToneLFOOptions> {
    enabled?: boolean;
    frequency?: number;
    min?: number;
    max?: number;
}
