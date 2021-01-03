import { RecursivePartial } from 'tone/build/esm/core/util/Interface';
import * as Tone from 'tone';
import { AbstractModuleOptions } from '../module/AbstractModule';
import { VoicingOptions } from './VoicingOptions';

export interface MetalOptions extends RecursivePartial<Tone.MetalSynthOptions>, AbstractModuleOptions, VoicingOptions {
    enabled?: boolean;
    enableRoutingFX?: boolean;
    enableRoutingFilter?: boolean;
    octaves?: number;
    harmonicity?: number;
    pan?: number; // -1; hard left; 1: hard right
    volume: number;
    modulationIndex?: number;
}
