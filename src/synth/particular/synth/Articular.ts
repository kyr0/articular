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
import thunderstorm from './preset/thunderstorm.json';
import thunderpad from './preset/thunderpad.json';
import stab from './preset/stab.json';
import { deepDiff } from './function/deepDiff';
import * as _ from 'lodash';
import { hasChanges } from './function/hasChanges';
import { clearScreenDown } from 'readline';

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
            case Module.LFO1:
                return this.lfo1.getSignal(signalId);
            case Module.LFO2:
                return this.lfo2.getSignal(signalId);
            case Module.LFO3:
                return this.lfo3.getSignal(signalId);
            case Module.LFO4:
                return this.lfo4.getSignal(signalId);
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
        const thunderstormPreset = (thunderstorm as unknown) as Preset;
        const thunderpadPreset = (thunderpad as unknown) as Preset;
        const stabPreset = (stab as unknown) as Preset;
        return {
            ['init']: initPreset,
            [stabPreset.id]: stabPreset,
            [thunderstormPreset.id]: thunderstormPreset,
            [thunderpadPreset.id]: thunderpadPreset,
            // TODO: add more built-in presets
        };
    }

    setupStaticRoutes() {
        // effectRack output -> masterFilter input
        // masterFilter internally routes to Tone.destination if disabled
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

    connectModuleDynamicallyRouted(module: any, enableRoutingFX: boolean) {
        if (module && enableRoutingFX) {
            module.disable();
            console.log('connectModuleDynamicallyRouted -> effectRack', module);
            module.setDestination(this.effectRack.inputGainNode);
            module.enable();
        } else if (module) {
            module.disable();
            console.log('connectModuleDynamicallyRouted -> masterFiter directly', module);
            module.setDestination(this.masterFilter.inputGainNode);
            module.enable();
        } else {
            console.warn('[Articular] connectDynamicallyRouted(): Module does not exist');
        }
    }

    set(options: RecursivePartial<ArticularOptions>) {
        console.log('[Articular] set options', options);

        this.connectModuleDynamicallyRouted(this.oscA, options.oscA?.enableRoutingFX || false);
        this.connectModuleDynamicallyRouted(this.oscB, options.oscB?.enableRoutingFX || false);
        this.connectModuleDynamicallyRouted(this.sub, options.sub?.enableRoutingFX || false);
        this.connectModuleDynamicallyRouted(this.noise, options.noise?.enableRoutingFX || false);
        this.connectModuleDynamicallyRouted(this.metal, options.metal?.enableRoutingFX || false);
        this.connectModuleDynamicallyRouted(this.pluck, options.pluck?.enableRoutingFX || false);

        this.options = mergeOptions(this.options, options as ArticularOptions)!;

        console.log('[Articular] new options', JSON.stringify(this.options, null, 4));

        const oldOscAConfig = { ...this.oscA.get(), ...this.options.voicing };
        const newOscAConfig = { ...this.options.oscA, ...this.options.voicing };
        if (hasChanges(oldOscAConfig, newOscAConfig)) {
            console.log('Setting oscA changes...');
            this.oscA.set(newOscAConfig);
        }

        const oldOscBConfig = { ...this.oscB.get(), ...this.options.voicing };
        const newOscBConfig = { ...this.options.oscB, ...this.options.voicing };
        if (hasChanges(oldOscBConfig, newOscBConfig)) {
            console.log('Setting oscB changes...', newOscBConfig);
            this.oscB.set(newOscBConfig);
        }

        const oldSubConfig = { ...this.sub.get(), ...this.options.voicing };
        const newSubConfig = { ...this.options.sub, ...this.options.voicing };
        if (hasChanges(oldSubConfig, newSubConfig)) {
            console.log('Setting sub changes...');
            this.sub.set(newSubConfig);
        }

        if (hasChanges(this.noise.get(), this.options.noise)) {
            console.log('Setting noise changes...');
            this.noise.set(this.options.noise);
        }

        const oldMetalConfig = { ...this.metal.get(), ...this.options.voicing };
        const newMetalConfig = { ...this.options.metal, ...this.options.voicing };
        if (hasChanges(oldMetalConfig, newMetalConfig)) {
            console.log('Setting metal changes...');
            this.metal.set(newMetalConfig);
        }

        if (hasChanges(this.pluck.get(), this.options.pluck)) {
            console.log('Setting pluck changes...');
            this.pluck.set(this.options.pluck);
        }

        if (hasChanges(this.lfo1.get(), this.options.lfo1)) {
            console.log('Setting lfo1 changes...');
            this.lfo1.set(this.options.lfo1);
        }

        if (hasChanges(this.lfo2.get(), this.options.lfo2)) {
            console.log('Setting lfo2 changes...');
            this.lfo2.set(this.options.lfo2);
        }

        if (hasChanges(this.lfo3.get(), this.options.lfo3)) {
            console.log('Setting lfo3 changes...');
            this.lfo3.set(this.options.lfo3);
        }

        if (hasChanges(this.lfo4.get(), this.options.lfo4)) {
            console.log('Setting lfo4 changes...');
            this.lfo4.set(this.options.lfo4);
        }

        if (hasChanges(this.masterFilter.get(), this.options.masterFilter)) {
            console.log('Setting masterFilter changes...');
            this.masterFilter.set(this.options.masterFilter);
        }

        if (this.options.effectRack) {
            console.log('Setting effectRack changes...');
            this.effectRack.set(this.options.effectRack);
        }

        this.masterGainNode.gain.rampTo(this.options.masterGain, 0.1, Tone.now());
    }

    addSignalRoute(signalRoute: SignalRoute, ignoreDoubleCheck?: boolean) {
        if (this.hasSignalRoute(signalRoute) && !ignoreDoubleCheck) return;
        console.log('addSignalRoute', signalRoute, this.options?.matrix);

        let source;
        const targetSignal = this.getSignal(signalRoute.target.module, signalRoute.target.signalId);

        if (signalRoute.source.type === 'lfo' && targetSignal && (this as any)[signalRoute.source.id]) {
            source = (this as any)[signalRoute.source.id] as LFO; // i.e. lfo1
            source.connect(targetSignal);

            console.log('targetSignal after connect', targetSignal);

            // add to options
            this.options?.matrix.routes.push(signalRoute);
        } else {
            console.error('signalRoute not of type LFO or no targetSignal found!');
        }
    }

    hasSignalRoute(signalRoute: SignalRoute): boolean {
        if (!this.options?.matrix || this.options.matrix.routes.length === 0) return false;

        for (let i = 0; i < this.options?.matrix.routes.length; i++) {
            const _signalRoute = this.options?.matrix.routes[i];
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
