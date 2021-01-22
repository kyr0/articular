import { EffectRackOptions } from './EffectRackOptions';
import { LFOOptions } from './LFOOptions';
import { MasterEnvelopeOptions } from './MasterEnvelopeOptions';
import { MasterFilterOptions } from './MasterFilterOptions';
import { MatrixOptions } from './MatrixOptions';
import { MetalOptions } from './MetalOptions';
import { NoiseOptions } from './NoiseOptions';
import { PluckOptions } from './PluckOptions';
import { PolySynthOptions } from './PolySynthOptions';
import { SignalRoute } from './SignalRoute';
import { SubSynthOptions } from './SubSynthOptions';
import { VoicingOptions } from './VoicingOptions';

export interface ArticularOptions {
    masterGain: number;
    oscA: PolySynthOptions;
    oscB: PolySynthOptions;
    sub: SubSynthOptions;
    noise: NoiseOptions;
    metal: MetalOptions;
    pluck: PluckOptions;
    masterFilter: MasterFilterOptions;
    effectRack: EffectRackOptions;
    matrix: MatrixOptions;
    lfo1: LFOOptions;
    lfo2: LFOOptions;
    lfo3: LFOOptions;
    lfo4: LFOOptions;
    voicing: VoicingOptions;
}
