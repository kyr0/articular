import { debounce } from '@material-ui/core';
import * as Tone from 'tone';
import { mergeOptions } from '../function/mergeOptions';
import { Note } from '../interface/Note';
import { PluckOptions } from '../interface/PluckOptions';
import { AbstractModule } from './AbstractModule';

export class Pluck extends AbstractModule<PluckOptions> {
    readonly toneNode = new Tone.PluckSynth();
    readonly pannerNode = new Tone.Panner();
    readonly envelope = new Tone.Envelope();

    protected prevNote?: Note;

    getRouting() {
        return [this.pannerNode, this.gainNode, this.destination];
    }

    set(options: PluckOptions) {
        super.set(options);

        if (this.pannerNode) {
            this.pannerNode.set({
                pan: options.pan || 0,
            });
        }

        this.gainNode.set({
            gain: options.volume * 2,
        });

        // TODO: routing
        if (this.envelope) {
            this.envelope.set({
                attack: options?.envelope?.attack || 0,
                decay: options?.envelope?.decay || 0.1,
                release: options?.envelope?.release || 0.3,
                sustain: options?.envelope?.sustain || 0.5,
            });
        }
    }

    noteOn = debounce((note: Note) => {
        this.toneNode.triggerAttack(`${note.name}${note.octave + (this.options?.octave || 0)}`, Tone.now());
    }, 20) as (note: Note) => void;

    noteOff(note: Note) {
        this.toneNode.triggerRelease(Tone.now());
    }

    getOptions(options: PluckOptions) {
        const _options = mergeOptions(this.options, options);

        return _options;
    }
}
