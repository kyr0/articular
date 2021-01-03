import { Note } from './Note';

export interface NoteReceiver {
    noteOn(note: Note): void;
    noteOff(note: Note): void;
}
