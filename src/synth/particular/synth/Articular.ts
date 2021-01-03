import * as Tone from 'tone';
import { DirectKeyboardSupport } from './feature/DirectKeyboardSupport';
import { DirectMIDISupport } from './feature/DirectMIDISupport';
import { mergeOptions } from './function/mergeOptions';
import { ArticularOptions } from './interface/ArticularOptions';
import { Module } from './interface/Module';
import { Note } from './interface/Note';
import { NoteReceiver } from './interface/NoteReceiver';
import { Preset } from './interface/Preset';
import { RecursivePartial } from './interface/RecursivePartial';
import { SignalName } from './interface/SignalName';
import { SignalRoute } from './interface/SignalRoute';
import { EffectRack } from './module/EffectRack';
import { LFO } from './module/LFO';
import { MasterFilter } from './module/MasterFilter';
import { Metal } from './module/Metal';
import { Noise } from './module/Noise';
import { Pluck } from './module/Pluck';
import { PolySynth } from './module/PolySynth';
import { SubSynth } from './module/SubSynth';
import { initPreset } from './preset/initPreset';

export enum GlobalSignals {
    MASTER = 'masterGain',
}

export class Articular implements NoteReceiver {
    // destination of the masterFilter
    readonly masterGainNode = new Tone.Gain();

    // source
    readonly oscA = new PolySynth();
    readonly oscB = new PolySynth();
    readonly sub = new SubSynth();
    readonly noise = new Noise();
    readonly metal = new Metal();
    readonly pluck = new Pluck();

    // effects
    readonly effectRack = new EffectRack();

    // modulation
    readonly lfo1 = new LFO();
    readonly lfo2 = new LFO();
    readonly lfo3 = new LFO();
    readonly lfo4 = new LFO();

    // filter
    readonly masterFilter = new MasterFilter();

    preset?: Preset;
    options?: ArticularOptions;

    constructor(
        protected enableDirectMIDIInput: boolean = true,
        protected enableDirectKeyboardInput: boolean = false,
        protected isConnected: boolean = true,
        protected presetId: string = 'init',
    ) {
        // helps receiving direct MIDI input
        if (enableDirectMIDIInput) {
            new DirectMIDISupport(this);
        }

        // trigger note playback from keyboard events
        if (enableDirectKeyboardInput) {
            new DirectKeyboardSupport(this);
        }
        this.setupStaticRoutes();

        this.setCurrentPreset(presetId);

        if (isConnected) {
            this.setConnected();
        }
    }

    getSignal(module: Module, signalId: string): Tone.Signal | undefined {
        switch (module) {
            case Module.OSC_A:
                return this.oscA.getSignal(signalId);
            case Module.OSC_B:
                return this.oscB.getSignal(signalId);
            case Module.SUB:
                return this.sub.getSignal(signalId);
            case Module.NOISE:
                return this.noise.getSignal(signalId);
            case Module.PLUCK:
                return this.pluck.getSignal(signalId);
            case Module.METAL:
                return this.metal.getSignal(signalId);
            case Module.MASTER_FILTER:
                return this.masterFilter.getSignal(signalId);
            case Module.GLOBAL:
                if (signalId === GlobalSignals.MASTER) {
                    return new Tone.Signal().connect(this.masterGainNode.gain);
                }
        }
    }

    getSignalNames(): Array<SignalName> {
        return [
            {
                id: 'masterGain',
                label: 'Master',
                description: 'Master volume',
            },
        ];
    }

    setCurrentPreset(presetId: string) {
        this.preset = this.getPresets()[presetId];
        this.set(this.preset.options);
    }

    getCurrentPreset(): Preset | undefined {
        return this.preset;
    }

    getPresets(): { [presetId: string]: Preset } {
        return {
            ['init']: initPreset,
            // TODO: add more built-in presets
        };
    }

    setupStaticRoutes() {
        // effectRack output -> masterFilter input
        this.effectRack.setDestination(this.masterFilter.inputGainNode);

        // masterFilter output -> masterGain input
        this.masterFilter.setDestination(this.masterGainNode);
    }

    setConnected() {
        // masterGain output -> audioContext destination
        this.masterGainNode.toDestination();
    }

    setDisconnected() {
        this.masterGainNode.disconnect();
    }

    noteOn(note: Note) {
        if (this.oscA.get()?.enabled) {
            this.oscA.noteOn(note);
        }

        if (this.oscB.get()?.enabled) {
            this.oscB.noteOn(note);
        }

        if (this.noise.get()?.enabled) {
            this.noise.noteOn(note);
        }

        if (this.sub.get()?.enabled) {
            this.sub.noteOn(note);
        }

        if (this.metal.get()?.enabled) {
            this.metal.noteOn(note);
        }

        if (this.pluck.get()?.enabled) {
            this.pluck.noteOn(note);
        }

        this.lfo1.startForNote(note);
        this.lfo2.startForNote(note);
        this.lfo3.startForNote(note);
        this.lfo4.startForNote(note);
    }

    noteOff(note: Note) {
        // must receive noteOff, no matter if disabled or not
        // otherwise it will glitch when the module is disabled
        // while playing notes and notes will legato forever
        this.oscA.noteOff(note);
        this.oscB.noteOff(note);
        this.noise.noteOff(note);
        this.sub.noteOff(note);
        this.metal.noteOff(note);
        this.pluck.noteOff(note);

        this.lfo1.stopForNote(note);
        this.lfo2.stopForNote(note);
        this.lfo3.stopForNote(note);
        this.lfo4.stopForNote(note);
    }

    set(options: RecursivePartial<ArticularOptions>) {
        console.log('[Articular] set options', options);

        // TODO: Route to effect when effect is enabled, else to filter, if filter enabled, else to destination
        // all sound generators output -> effectRack input (parallel)
        this.oscA.setDestination(this.effectRack.inputGainNode);
        this.oscB.setDestination(this.effectRack.inputGainNode);
        this.sub.setDestination(this.effectRack.inputGainNode);
        this.noise.setDestination(this.effectRack.inputGainNode);
        this.metal.setDestination(this.effectRack.inputGainNode);
        this.pluck.setDestination(this.effectRack.inputGainNode);

        this.options = mergeOptions(this.options, options as ArticularOptions)!;

        console.log('[Articular] new options', this.options);

        this.oscA.set({ ...this.options.oscA, ...this.options.voicing });
        this.oscB.set({ ...this.options.oscB, ...this.options.voicing });
        this.sub.set({ ...this.options.sub, ...this.options.voicing });
        this.noise.set(this.options.noise);
        this.metal.set({ ...this.options.metal, ...this.options.voicing });
        this.pluck.set(this.options.pluck);

        this.lfo1.set(this.options.lfo1);
        this.lfo2.set(this.options.lfo2);
        this.lfo3.set(this.options.lfo3);
        this.lfo4.set(this.options.lfo4);

        this.masterFilter.set(this.options.masterFilter);

        this.effectRack.set(this.options.effectRack);

        this.masterGainNode.gain.rampTo(this.options.masterGain, 0.1, Tone.now());
    }

    addSignalRoute(signalRoute: SignalRoute) {
        console.log('addSignalRoute', signalRoute, this.options?.matrix);
        if (this.hasSignalRoute(signalRoute)) return;

        let source;
        const targetSignal = this.getSignal(signalRoute.target.module, signalRoute.target.signalId);

        if (signalRoute.source.type === 'lfo' && targetSignal && (this as any)[signalRoute.source.id]) {
            source = (this as any)[signalRoute.source.id] as LFO; // i.e. lfo1
            source.connect(targetSignal);

            console.log('targetSignal after connect', targetSignal);

            // add to options
            this.options?.matrix.push(signalRoute);
        } else {
            console.error('signalRoute not of type LFO or no targetSignal found!');
        }
    }

    hasSignalRoute(signalRoute: SignalRoute): boolean {
        if (!this.options?.matrix || this.options.matrix.length === 0) return false;

        for (let i = 0; i < this.options?.matrix.length; i++) {
            const _signalRoute = this.options?.matrix[i];
            if (
                _signalRoute.source.id === signalRoute.source.id &&
                _signalRoute.source.type === signalRoute.source.type &&
                _signalRoute.target.signalId === signalRoute.target.signalId &&
                _signalRoute.target.module === signalRoute.target.module
            ) {
                return true;
            }
        }
        return false;
    }

    removeSignalRoute(signalRoute: SignalRoute) {
        console.log('removeSignalRoute', signalRoute);
    }

    get(): ArticularOptions | undefined {
        return this.options;
    }
}
