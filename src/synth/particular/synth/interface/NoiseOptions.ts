import * as Tone from 'tone';
import { AbstractModuleOptions } from '../module/AbstractModule';
import { RecursivePartial } from './RecursivePartial';

export interface NoiseOptions extends RecursivePartial<Tone.NoiseSynthOptions>, AbstractModuleOptions {
    enabled?: boolean;
    enableRoutingFX?: boolean;
    enableRoutingFilter?: boolean;
    pan?: number;
    volume: number;
}
