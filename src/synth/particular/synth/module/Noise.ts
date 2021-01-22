import * as Tone from 'tone';
import { debounce } from '../function/debounce';
import { NoiseOptions } from '../interface/NoiseOptions';
import { Note } from '../interface/Note';
import { AbstractModule } from './AbstractModule';

export class Noise extends AbstractModule<NoiseOptions> {
    readonly gainNode = new Tone.Gain();
    readonly toneNode: any = new Tone.NoiseSynth();

    protected prevNote?: Note;
    readonly pannerNode = new Tone.Panner();

    noteOn = debounce((note: Note) => {
        this.prevNote = note;
        this.toneNode.triggerAttack(Tone.now(), note.velocity);
    }, 20) as (note: Note) => void;

    noteOff(note: Note) {
        if (note.name === this.prevNote?.name) {
            this.toneNode.triggerRelease(Tone.now());
        }
    }

    getRouting() {
        return [this.pannerNode, this.gainNode, this.destination];
    }

    set(options: NoiseOptions) {
        super.set(options);

        if (this.pannerNode) {
            this.pannerNode.set({
                pan: options.pan || 0,
            });
        }
    }
}
