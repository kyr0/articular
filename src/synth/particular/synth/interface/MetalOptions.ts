import { RecursivePartial } from 'tone/build/esm/core/util/Interface';
import * as Tone from 'tone';
import { VoicingOptions } from './VoicingOptions';
import { AbstractModuleOptions } from './AbstractModuleOptions';

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
