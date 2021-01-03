export type EffectType = 'AutoFilter' | 'AutoPanner' | 'AutoWah' | 'BitCrusher' | 'Chebyshev' | 
                         'Chorus' | 'Distortion' | 'FeedbackDelay' | 'Freeverb' | 'FrequencyShifter' |
                         'JCReverb' | 'MidSideEffect' | 'Phaser' | 'PingPongDelay' | 'PitchShift' |
                         'Reverb' | 'StereoWidener' | 'Tremolo' | 'Vibrato' | 
                         'Compressor' | 'Limiter' | 'EQ3'  ;

export interface EffectOptions<T> {
    enabled?: boolean;
    type?: EffectType;
    volume: number; // mix
    options?: T
}