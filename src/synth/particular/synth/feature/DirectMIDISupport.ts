import WebMidi, { Input, InputEventNoteoff, InputEventNoteon, WebMidiEventConnected } from 'webmidi';
import { NoteReceiver } from '../interface/NoteReceiver';

export class DirectMIDISupport {
    constructor(protected noteReceiver: NoteReceiver) {
        this.doListenToMIDIEvents();
    }

    listenToMIDIInput(input: Input) {
        console.log('[DirectMidiInput] Listen to input...', input.name);

        // key down
        input.addListener('noteon', 'all', (evt: InputEventNoteon) => {
            //console.log('[DirectMidiInput] noteOn', evt);
            this.noteReceiver.noteOn({
                name: evt.note.name,
                velocity: evt.velocity,
                octave: evt.note.octave,
            });
        });

        // key up
        input.addListener('noteoff', 'all', (evt: InputEventNoteoff) => {
            //console.log('[DirectMidiInput] noteOff', evt);
            this.noteReceiver.noteOff({
                name: evt.note.name,
                velocity: evt.velocity,
                octave: evt.note.octave,
            });
        });
    }

    handleMidiDeviceConnected = (evt: WebMidiEventConnected) => {
        if (evt.port.type === 'input') {
            const newInput = WebMidi.getInputById(evt.port.id);
            console.log('[DirectMidiInput] New device connected: ', evt.port.name, 'Starting to listen...');
            if (newInput) {
                this.listenToMIDIInput(newInput);
            }
        }
    };

    doListenToMIDIEvents() {
        WebMidi.enable((err?: Error) => {
            if (err) {
                console.error(err);
                console.error('[DirectMidiInput] Disabled due to an error');
                return;
            }

            // also listen to newly connected devices
            WebMidi.addListener('connected', this.handleMidiDeviceConnected);

            console.log('[DirectMidiInput] Enabled');
            console.log('[DirectMidiInput] Inputs', WebMidi.inputs);
            console.log('[DirectMidiInput] Outputs', WebMidi.outputs);
        });
    }
}
