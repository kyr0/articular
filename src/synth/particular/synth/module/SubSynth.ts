import * as Tone from 'tone';
import { mergeOptions } from '../function/mergeOptions';
import { SubSynthOptions } from '../interface/SubSynthOptions';
import { AbstractModule } from './AbstractModule';

export class SubSynth extends AbstractModule<SubSynthOptions> {
    readonly gainNode = new Tone.Gain();
    readonly toneNode = new Tone.PolySynth({
        maxPolyphony: 64,
    });

    readonly pannerNode = new Tone.Panner();

    getRouting() {
        return [this.pannerNode, this.gainNode, this.destination];
    }

    set(options: SubSynthOptions) {
        super.set(options);

        if (this.pannerNode) {
            this.pannerNode.set({
                pan: options.pan || 0,
            });
        }
    }

    getOptions(options: SubSynthOptions) {
        const _options = mergeOptions(this.options, options);

        (_options?.oscillator as any).detune = _options?.detune || 0;

        _options!.portamento = _options?.glide;

        if (_options && _options.oscillator) {
            _options.oscillator.type = _options?.waveForm as any;
        }
        return _options;
    }
}
