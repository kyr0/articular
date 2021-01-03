import { debounce } from '@material-ui/core';
import * as Tone from 'tone';
import { LFOOptions } from '../interface/LFOOptions';
import { Note } from '../interface/Note';

export class LFO {
    readonly toneNode = new Tone.LFO();
    protected prevNote?: Note;

    set(options: LFOOptions) {
        this.toneNode.set(options);
    }

    startForNote = debounce((note: Note) => {
        this.prevNote = note;
        this.toneNode.start();
    }, 20) as (note: Note) => void;

    stopForNote(note: Note) {
        if (note.name === this.prevNote?.name) {
            this.toneNode.stop();
        }
    }

    connect(signal: Tone.Signal) {
        this.toneNode.connect(signal);
    }

    disconnect(signal: Tone.Signal) {
        this.toneNode.disconnect(signal);
    }
}
