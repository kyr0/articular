import { debounce } from '@material-ui/core';
import * as Tone from 'tone';
import { MetalSynthOptions } from 'tone';
import { mergeOptions } from '../function/mergeOptions';
import { MetalOptions } from '../interface/MetalOptions';
import { Note } from '../interface/Note';
import { AbstractModule } from './AbstractModule';

export class Metal extends AbstractModule<MetalOptions> {
    readonly gainNode = new Tone.Gain();
    readonly toneNode = new Tone.MetalSynth();

    protected prevNote?: Note;
    readonly pannerNode = new Tone.Panner();

    getRouting() {
        return [this.pannerNode, this.gainNode, this.destination];
    }

    set(options: MetalOptions) {
        super.set(options);

        if (this.pannerNode) {
            this.pannerNode.set({
                pan: options.pan || 0,
            });
        }
    }

    noteOn = debounce((note: Note) => {
        this.toneNode.triggerAttack(
            `${note.name}${note.octave + (this.options?.octave || 0)}`,
            Tone.now(),
            note.velocity,
        );
    }, 20) as (note: Note) => void;

    noteOff(note: Note) {
        this.toneNode.triggerRelease(Tone.now());
    }

    getOptions(options: MetalOptions) {
        const _options = mergeOptions(this.options, options);

        (_options as MetalSynthOptions).detune = _options?.detune || 0;

        _options!.portamento = _options?.glide;

        return _options;
    }
}
