import { RecursivePartial } from 'tone/build/esm/core/util/Interface';
import * as Tone from 'tone';
import { AbstractModuleOptions } from './AbstractModuleOptions';

export interface PluckOptions extends RecursivePartial<Tone.PluckSynthOptions>, AbstractModuleOptions {
    enabled?: boolean;
    enableRoutingFX?: boolean;
    enableRoutingFilter?: boolean;
    envelope?: RecursivePartial<Tone.EnvelopeOptions>;
    pan?: number; // -1; hard left; 1: hard right
    volume: number;
}
