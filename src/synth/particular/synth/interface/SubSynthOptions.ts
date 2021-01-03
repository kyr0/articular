import * as Tone from 'tone';
import { AbstractModuleOptions } from '../module/AbstractModule';
import { RecursivePartial } from './RecursivePartial';
import { VoicingOptions } from './VoicingOptions';
import { WaveForm } from './Waveform';

export interface SubSynthOptions extends RecursivePartial<Tone.SynthOptions>, AbstractModuleOptions, VoicingOptions {
    enabled?: boolean;
    enableRoutingFX?: boolean;
    enableRoutingFilter?: boolean;
    pan?: number;
    waveForm?: WaveForm;
    octave?: number;
    detune?: number;
    volume: number;
}
