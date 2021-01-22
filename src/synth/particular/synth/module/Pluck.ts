import { debounce } from '@material-ui/core';
import * as Tone from 'tone';
import { mergeOptions } from '../function/mergeOptions';
import { Note } from '../interface/Note';
import { PluckOptions } from '../interface/PluckOptions';
import { AbstractModule } from './AbstractModule';

export class Pluck extends AbstractModule<PluckOptions> {
    readonly gainNode = new Tone.Gain();
    readonly toneNode = new Tone.PluckSynth();
    readonly pannerNode = new Tone.Panner();

    protected prevNote?: Note;

    getRouting() {
        return [this.pannerNode, this.gainNode, this.destination];
    }

    set(options: PluckOptions) {
        super.set(options);

        this.pannerNode?.set({
            pan: options.pan || 0,
        });

        this.gainNode?.set({
            gain: options.volume,
        });
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
