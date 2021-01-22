import { RecursivePartial } from 'tone/build/esm/core/util/Interface';
import * as Tone from 'tone';
import { AdvancedModulationType } from './AdvancedModulationType';
import { WaveForm } from './Waveform';
import { VoicingOptions } from './VoicingOptions';
import { AbstractModuleOptions } from './AbstractModuleOptions';

export interface PolySynthOptions extends RecursivePartial<Tone.SynthOptions>, AbstractModuleOptions, VoicingOptions {
    enabled?: boolean;
    enableRoutingFX?: boolean;
    enableRoutingFilter?: boolean;
    octave?: number;
    harmonicity?: number;
    advancedModulationType?: AdvancedModulationType;
    subModulationType: WaveForm;
    unison?: number;
    pan?: number; // -1; hard left; 1: hard right
    spread?: number;
    waveTablePosition?: number; // 0 - 32
    waveForm?: WaveForm;
    volume: number;
    modulationIndex?: number;
}
