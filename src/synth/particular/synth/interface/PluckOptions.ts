import { RecursivePartial } from 'tone/build/esm/core/util/Interface';
import * as Tone from 'tone';
import { AbstractModuleOptions } from '../module/AbstractModule';

export interface PluckOptions extends RecursivePartial<Tone.PluckSynthOptions>, AbstractModuleOptions {
    enabled?: boolean;
    enableRoutingFX?: boolean;
    enableRoutingFilter?: boolean;
    envelope?: Tone.EnvelopeOptions;
    pan?: number; // -1; hard left; 1: hard right
    volume: number;
}
