import * as Tone from 'tone';
import { mergeOptions } from '../function/mergeOptions';
import { AbstractModuleOptions } from '../interface/AbstractModuleOptions';
import { Modulatable } from '../interface/Modulatable';
import { Note } from '../interface/Note';
import { SignalName } from '../interface/SignalName';

export abstract class AbstractModule<T extends AbstractModuleOptions> implements Modulatable {
    readonly toneNode?: any;
    readonly gainNode?: Tone.Gain;

    protected destination?: any;
    protected options?: T;
    protected isEnabled = false;

    getSignal(signalId: string): Tone.Signal {
        return new Tone.Signal().connect(this.toneNode[signalId]);
    }

    getSignalNames(): Array<SignalName> {
        return [];
    }

    getRouting() {
        return [this.gainNode, this.destination];
    }

    setDestination(destination: any) {
        this.destination = destination;
    }

    shouldEnable() {
        return this.options?.enabled && !this.isEnabled;
    }

    enable() {
        this.toneNode.chain(...this.getRouting());
        this.onAfterEnabled();
    }

    onAfterEnabled() {
        this.isEnabled = true;
    }

    shouldDisable() {
        return !this.options?.enabled;
    }

    disable() {
        if (this.toneNode) {
            this.toneNode?.disconnect();
        }
        this.onAfterDisabled();
    }

    onAfterDisabled() {
        this.isEnabled = false;
    }

    noteOn(note: Note) {
        this.toneNode?.triggerAttack(
            `${note.name}${note.octave + (this.options?.octave || 0)}`,
            Tone.now(),
            note.velocity,
        );
    }

    noteOff(note: Note) {
        this.toneNode?.triggerRelease(`${note.name}${note.octave + (this.options?.octave || 0)}`, Tone.now());
    }

    getOptions(options: T) {
        console.log('[Articular] getOptions abstract', Object.getPrototypeOf(this).constructor.name);
        return mergeOptions(this.options, options);
    }

    set(options: T) {
        console.log('[Articular] abstract set', Object.getPrototypeOf(this).constructor.name);
        this.options = this.getOptions(options);

        if (this.gainNode) {
            console.log('setting gainNode', this.options?.volume);
            this.gainNode?.set({
                gain: this.options?.volume,
            });
        }

        if (this.shouldEnable()) {
            console.log('enabling', this.constructor.name);
            this.enable();
        }
        if (this.shouldDisable()) {
            console.log('disabling', this.constructor.name);
            this.disable();
        }

        if (this.toneNode) {
            console.log('module set', this.toneNode);
            this.toneNode.set(this.options);
        }
    }

    get() {
        return this.options;
    }
}
