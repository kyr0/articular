import { debounce } from '@material-ui/core';
import * as Tone from 'tone';
import { LFOOptions } from '../interface/LFOOptions';
import { Modulatable } from '../interface/Modulatable';
import { Note } from '../interface/Note';
import { SignalName } from '../interface/SignalName';
import { AbstractModule } from './AbstractModule';

export class LFO extends AbstractModule<LFOOptions> implements Modulatable {
    readonly toneNode = new Tone.LFO();
    protected prevNote?: Note;
    protected amountNode = new Tone.Add({
        value: 0,
    });

    getSignal(signalId: string): Tone.Signal {
        if (signalId === 'amount') {
            return this.amountNode;
        } else {
            return new Tone.Signal().connect((this.toneNode as any)[signalId]);
        }
    }

    getSignalNames(): Array<SignalName> {
        return [
            {
                id: 'amount',
                label: 'Amount',
                description: 'Aggregated amount',
            },
        ];
    }

    getRouting() {
        return [this.amountNode];
    }

    startForNote = debounce((note: Note) => {
        this.prevNote = note;
        this.toneNode.start();
    }, 20) as (note: Note) => void;

    stopForNote(note: Note) {
        if (note.name === this.prevNote?.name && note.octave === this.prevNote.octave) {
            this.toneNode.stop();
        }
    }

    connect(signal: Tone.Signal) {
        this.amountNode.connect(signal);
    }

    disconnect(signal: Tone.Signal) {
        this.amountNode.disconnect(signal);
    }
}
