import * as Tone from 'tone';
import { AMOscillatorOptions, FatOscillatorOptions, FMOscillatorOptions } from 'tone';
import { mergeOptions } from '../function/mergeOptions';
import { AdvancedModulationType } from '../interface/AdvancedModulationType';
import { PolySynthOptions } from '../interface/PolySynthOptions';
import { WaveForm } from '../interface/Waveform';
import { AbstractModule } from './AbstractModule';

export class PolySynth extends AbstractModule<PolySynthOptions> {
    readonly gainNode = new Tone.Gain();
    readonly toneNode: any = new Tone.PolySynth({
        maxPolyphony: 64,
    });

    readonly pannerNode = new Tone.Panner();

    getRouting() {
        return [this.pannerNode, this.gainNode, this.destination];
    }

    set(options: PolySynthOptions) {
        super.set(options);

        if (this.pannerNode) {
            this.pannerNode.set({
                pan: options.pan || 0,
            });
        }
    }

    getOptions(options: PolySynthOptions) {
        const _options = mergeOptions(this.options, options);

        _options!.portamento = _options?.glide;

        let oscType: string = WaveForm.PULSE;

        const ofAny = (_options!.oscillator as any).partials instanceof Array;
        if (
            _options &&
            _options.oscillator &&
            _options.waveForm === WaveForm.CUSTOM &&
            (!ofAny || (_options.oscillator as any).partials.length === 0)
        ) {
            (_options.oscillator as any).partials = [1];
        }

        if (_options?.waveForm !== WaveForm.PULSE && _options?.waveForm !== WaveForm.PWM) {
            oscType = `${
                _options?.advancedModulationType !== AdvancedModulationType.NONE ? _options?.advancedModulationType : ''
            }${_options?.waveForm}${_options?.waveTablePosition ? _options?.waveTablePosition : ''}`;
        }

        if (_options?.waveForm === WaveForm.PWM) {
            oscType = WaveForm.PWM;
        }

        if (_options?.advancedModulationType === AdvancedModulationType.FAT) {
            (_options?.oscillator as FatOscillatorOptions).count = _options?.unison || 1;
            (_options?.oscillator as FatOscillatorOptions).spread = _options?.spread || 0;
        }

        if (
            _options?.advancedModulationType === AdvancedModulationType.AM ||
            _options?.advancedModulationType === AdvancedModulationType.FM
        ) {
            (_options?.oscillator as AMOscillatorOptions).harmonicity = _options?.harmonicity || 0;
            (_options?.oscillator as AMOscillatorOptions).modulationType =
                (_options?.subModulationType as any) || 'sine';
            (_options?.oscillator as FMOscillatorOptions).modulationIndex = (_options?.modulationIndex as any) || 0;
        }

        if (_options && _options.oscillator) {
            _options.oscillator.type = oscType as any;
            (_options.oscillator as any).detune = _options.detune || 0;
        }
        return _options;
    }
}
