export type FXModuleType =
    | 'reverb'
    | 'compressor'
    | 'distortion'
    | 'wah'
    | 'bitcrusher'
    | 'chebyshev'
    | 'chorus'
    | 'feedbackdelay'
    | 'freeverb'
    | 'jcreverb'
    | 'frequencyshifter'
    | 'phaser'
    | 'pingpongdelay'
    | 'pitchshift'
    | 'stereowidener'
    | 'tremolo'
    | 'vibrato'
    | 'eq3';
export interface FXModule<T> {
    name: FXModuleType;
    index: number;
    label: string;
    enabled: boolean;
    config: T;
}
