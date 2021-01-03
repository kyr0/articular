import { Note } from '../interface/Note';
import { NoteReceiver } from '../interface/NoteReceiver';

export interface PianoKeyMap {
    [key: string]: Note;
}

export class DirectKeyboardSupport {
    keyMap: PianoKeyMap = {
        '1': {
            name: 'DECREASE_PITCHBEND',
            octave: 0,
        },
        '2': {
            name: 'INCREASE_PITCHBEND',
            octave: 0,
        },
        Y: {
            name: 'DECREASE_OCTAVE',
            octave: 0,
        },
        X: {
            name: 'INCREASE_OCTAVE',
            octave: 0,
        },
        C: {
            name: 'DECREASE_VELOCITY',
            octave: 0,
        },
        V: {
            name: 'INCREASE_VELOCITY',
            octave: 0,
        },
        A: {
            name: 'C',
            octave: 4,
        },
        W: {
            name: 'C#',
            octave: 4,
        },
        S: {
            name: 'D',
            octave: 4,
        },
        E: {
            name: 'D#',
            octave: 4,
        },
        D: {
            name: 'E',
            octave: 4,
        },
        F: {
            name: 'F',
            octave: 4,
        },
        T: {
            name: 'F#',
            octave: 4,
        },
        G: {
            name: 'G',
            octave: 4,
        },
        Z: {
            name: 'G#',
            octave: 4,
        },
        H: {
            name: 'A',
            octave: 4,
        },
        U: {
            name: 'A#',
            octave: 4,
        },
        J: {
            name: 'B',
            octave: 4,
        },
        // TODO
    };

    constructor(protected noteReceiver: NoteReceiver) {
        this.doListenToKeyboardEvents();
    }

    // TODO: key mapping dynamically, default (AwSeDFtGzHuJKofLpÖÄ) starting with C3
    // TODO: y and x for increased octave (default)
    // TODO: c ans v for velocity (default)

    doListenToKeyboardEvents() {
        console.log('[DirectKeyboardSupport] Enabled');

        window.addEventListener('keydown', (evt: KeyboardEvent) => {
            console.log('[DirectKeyboardSupport] keydown', evt);
            // TODO: detect keys pressed
        });

        window.addEventListener('keyup', (evt: KeyboardEvent) => {
            console.log('[DirectKeyboardSupport] keyup', evt);
            // TODO: detect keys pressed
        });
    }
}
