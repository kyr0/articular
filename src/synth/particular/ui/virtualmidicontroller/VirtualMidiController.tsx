import Grid from '@material-ui/core/Grid';
import React, {
    createContext,
    Fragment,
    memo,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useEvent } from 'react-use';
import { EVENT_NOTE_OFF, EVENT_NOTE_ON, NoteBusContext } from '../../bus/NoteBusManager';
import { getKeyboardShortcutsForNote } from './function/getKeyboardShortcutsForNote';
import { getNotesBetween } from './function/getNotesBetween';
import { isAccidentalNote } from './function/isAccidentialNote';
import { isRegularKey } from './function/isRegularKey';
import { getClasses } from './VirtualMidiController.jss';

export interface RenderPianoKeyProps {
    note: string;
    isNoteAccidental: boolean;
    isNotePlaying: boolean;
    startPlayingNote: (note: any) => void;
    stopPlayingNote: (note: any) => void;
    keyboardShortcuts: Array<any>;
}

export const PianoContainer = memo(({ children }: PropsWithChildren<any>) => {
    const classes = getClasses();
    return (
        <div className={classes.container} onMouseDown={(event) => event.preventDefault()}>
            {children}
        </div>
    );
});

export const AccidentalKey = memo(({ isPlaying, text, eventHandlers }: any) => {
    const classes = getClasses();
    const keyboardMap = useContext(KeyboardMapContext);
    const key = keyboardMap[text] || '';
    return (
        <div className={classes.accidentialKeyWrapper}>
            <button
                className={`${classes.accidentialKey} ${isPlaying ? classes.accidentialKeyPlaying : ''}`}
                {...eventHandlers}
            >
                <div className={classes.accidentialTextKey}>{key.substring(0, key.length - 1)}</div>
                <div className={classes.accidentialText}>{text}</div>
            </button>
        </div>
    );
});

export const NaturalKey = memo(({ isPlaying, text, eventHandlers }: any) => {
    const classes = getClasses();
    const keyboardMap = useContext(KeyboardMapContext);

    const key = keyboardMap[text] || '';

    return (
        <button className={`${classes.naturalKey} ${isPlaying ? classes.naturalKeyPlaying : ''}`} {...eventHandlers}>
            <div className={classes.textKey}>{key.substring(0, key.length - 1)}</div>
            <div className={classes.text}>{text}</div>
        </button>
    );
});

export const PianoKey = memo(
    ({
        note,
        isNoteAccidental,
        isNotePlaying,
        startPlayingNote,
        stopPlayingNote,
        keyboardShortcuts,
    }: RenderPianoKeyProps) => {
        const [eventHandlers, setEventHandlers] = useState({});

        const handleMouseEnter = useCallback(
            (event: any) => {
                if (event.buttons) {
                    startPlayingNote(note);
                }
            },
            [startPlayingNote, note],
        );

        useEffect(() => {
            setEventHandlers({
                onMouseDown: () => startPlayingNote(note),
                onTouchStart: () => startPlayingNote(note),
                onMouseEnter: (event: KeyboardEvent) => handleMouseEnter(event),
                onMouseUp: () => stopPlayingNote(note),
                onMouseOut: () => stopPlayingNote(note),
                onTouchEnd: () => stopPlayingNote(note),
            });
        }, [setEventHandlers, startPlayingNote, stopPlayingNote]);

        return isNoteAccidental ? (
            <AccidentalKey
                isPlaying={isNotePlaying}
                text={keyboardShortcuts.join(' / ')}
                eventHandlers={eventHandlers}
            />
        ) : (
            <NaturalKey isPlaying={isNotePlaying} text={keyboardShortcuts.join(' / ')} eventHandlers={eventHandlers} />
        );
    },
);

export interface PianoKeyboardMap {
    [key: string]: string;
}

export const KeyboardMapContext = createContext<PianoKeyboardMap>({});

export interface InstrumentAudioProps {
    notes: Array<any>;
}

export interface InstrumentProps {
    renderInstrument: any;
    renderAudio: any;
    keyboardMap: any;
}

export const Instrument = memo(
    ({ keyboardMap, renderAudio, renderInstrument: CustomInstrument }: InstrumentProps): any => {
        const [notesPlaying, setNotesPlaying] = useState<{
            notesPlaying: Array<any>;
            stopNotes: Array<any>;
            startNotes: Array<any>;
        }>({
            notesPlaying: [],
            stopNotes: [],
            startNotes: [],
        });

        useEffect(() => {
            renderAudio({ notes: notesPlaying });
        }, [notesPlaying, renderAudio]);

        const getNoteFromKeyboardKey = useCallback(
            (keyboardKey: any) => {
                return keyboardMap[keyboardKey.toUpperCase()];
            },
            [keyboardMap],
        );

        const startPlayingNote = useCallback(
            (note: any) => {
                setNotesPlaying(({ notesPlaying }: any) => ({
                    notesPlaying: [...notesPlaying, note],
                    startNotes: [note],
                    stopNotes: [],
                }));
            },
            [setNotesPlaying],
        );

        const onKeyDown = useCallback(
            (event: KeyboardEvent) => {
                if (isRegularKey(event) && !event.repeat) {
                    const note = getNoteFromKeyboardKey(event.key);
                    if (note) {
                        startPlayingNote(note);
                    }
                }
            },
            [setNotesPlaying],
        );

        useEvent('keydown', onKeyDown);

        const stopPlayingNote = useCallback(
            (note: any) => {
                setNotesPlaying(({ notesPlaying }: any) => ({
                    notesPlaying: notesPlaying.filter((notePlaying: any) => notePlaying !== note),
                    stopNotes: notesPlaying.filter((notePlaying: any) => notePlaying === note),
                    startNotes: [],
                }));
            },
            [setNotesPlaying],
        );

        const onKeyUp = useCallback((event: KeyboardEvent) => {
            if (isRegularKey(event)) {
                const note = getNoteFromKeyboardKey(event.key);
                if (note) {
                    stopPlayingNote(note);
                }
            }
        }, []);

        useEvent('keyup', onKeyUp);

        return (
            <Fragment>
                <CustomInstrument
                    notesPlaying={notesPlaying.notesPlaying}
                    startPlayingNote={startPlayingNote}
                    stopPlayingNote={stopPlayingNote}
                />
            </Fragment>
        );
    },
);

export const Piano = memo(({ startNote, endNote, keyboardMap, renderPianoKey, renderAudio }: any) => {
    const notes = getNotesBetween(startNote, endNote);

    return (
        <Instrument
            keyboardMap={keyboardMap}
            renderInstrument={({ notesPlaying, startPlayingNote, stopPlayingNote }: any) =>
                notes.map((note: any) => (
                    <Fragment key={note}>
                        {renderPianoKey({
                            note,
                            isNoteAccidental: isAccidentalNote(note),
                            startPlayingNote,
                            stopPlayingNote,
                            isNotePlaying: notesPlaying.includes(note),
                            keyboardShortcuts: getKeyboardShortcutsForNote(keyboardMap, note),
                        })}
                    </Fragment>
                ))
            }
            renderAudio={renderAudio}
        />
    );
});

export const VELOCITY_MIDI_MID = 0.5;

export const VirtualMidiController = memo(() => {
    const classes = getClasses();
    const noteBusContext = useContext(NoteBusContext);

    const [velocity, setVelocity] = useState(VELOCITY_MIDI_MID);
    const [relativeOctave, setRelativeOcatve] = useState(3);

    useEffect(() => {
        // TODO: re-define keyboardMap!
    }, [relativeOctave]);

    const [keyboardMap, setKeyboardMap] = useState({
        A: 'C3',
        W: 'C#3',
        S: 'D3',
        E: 'D#3',
        D: 'E3',
        F: 'F3',
        T: 'F#3',
        G: 'G3',
        Z: 'G#3',
        H: 'A3',
        U: 'A#3',
        J: 'B3',
        K: 'C4',
        O: 'C#4',
        L: 'D4',
        P: 'D#4',
        Ö: 'E4',
        Ä: 'F4',
        '+': 'F#4',
        '#': 'G4',
    });

    const renderPianoKey = useCallback(
        () => (pianoKeyProps: RenderPianoKeyProps) => <PianoKey {...pianoKeyProps} />,
        [],
    );

    const propagateNote = useCallback(
        (event: string, note: string) => {
            const octave = parseInt(note.substring(note.length - 1, note.length), 10);
            const noteName = note.substring(0, note.length - 1);

            noteBusContext.publish(event, {
                name: noteName,
                octave, // TODO: +relativeOctave
                velocity,
            });
        },
        [noteBusContext, velocity, relativeOctave],
    );

    const onNotesPlayedChange = useCallback(
        () => ({
            notes, // (Array) An array of the currently playing notes
        }: any) => {
            if (!notes.startNotes.length && !notes.stopNotes.length) return;
            /* Play the given notes and render the audio (or return null) */
            if (notes.startNotes.length) {
                notes.startNotes.forEach((note: string) => {
                    propagateNote(EVENT_NOTE_ON, note);
                });
            }

            if (notes.stopNotes.length) {
                notes.stopNotes.forEach((note: string) => {
                    propagateNote(EVENT_NOTE_OFF, note);
                });
            }
        },
        [propagateNote],
    );

    return (
        <Grid container>
            <Grid item xs={12} className={classes.pianoContainer}>
                <KeyboardMapContext.Provider value={keyboardMap}>
                    <div className={classes.container}>
                        <div className={classes.pianoBrand}>
                            Press a mapped key or connect a real MIDI device (Plug &amp; Play).
                        </div>
                        <Piano
                            startNote="C3"
                            endNote="C6"
                            keyboardMap={keyboardMap}
                            renderAudio={onNotesPlayedChange()}
                            renderPianoKey={renderPianoKey()}
                        />
                    </div>
                </KeyboardMapContext.Provider>
            </Grid>
        </Grid>
    );
});
