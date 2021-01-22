import * as Tone from 'tone';
import { Effect } from 'tone/build/esm/effect/Effect';
import { EffectRackOptions } from '../interface/EffectRackOptions';
import { FXModule } from '../interface/FXModule';
import { AbstractModule } from './AbstractModule';

export interface EffectInstances {
    [effectInstanceName: string]: {
        index: number;
        instance?: any;
        enabled?: boolean;
    };
}

export class EffectRack extends AbstractModule<EffectRackOptions> {
    readonly inputGainNode = new Tone.Gain();
    readonly gainNode = new Tone.Gain();
    option?: EffectRackOptions;

    effectInstances?: EffectInstances;
    wires: Array<Array<Effect<any>>> = [];

    createEffectInstance(module: FXModule<any>) {
        console.log('EFFECT createInstance', module.name);

        switch (module.name) {
            case 'reverb':
                this.effectInstances![module.name].instance = new Tone.Reverb();
                break;
            case 'compressor':
                this.effectInstances![module.name].instance = new Tone.Compressor();
                break;
            case 'chorus':
                this.effectInstances![module.name].instance = new Tone.Chorus();
                break;
            case 'bitcrusher':
                this.effectInstances![module.name].instance = new Tone.BitCrusher();
                break;
            case 'chebyshev':
                this.effectInstances![module.name].instance = new Tone.Chebyshev();
                break;
            case 'distortion':
                this.effectInstances![module.name].instance = new Tone.Distortion();
                break;
            case 'eq3':
                this.effectInstances![module.name].instance = new Tone.EQ3();
                break;
            case 'feedbackdelay':
                this.effectInstances![module.name].instance = new Tone.FeedbackDelay();
                break;
            case 'freeverb':
                this.effectInstances![module.name].instance = new Tone.Freeverb();
                break;
            case 'frequencyshifter':
                this.effectInstances![module.name].instance = new Tone.FrequencyShifter();
                break;
            case 'jcreverb':
                this.effectInstances![module.name].instance = new Tone.JCReverb();
                break;
            case 'phaser':
                this.effectInstances![module.name].instance = new Tone.Phaser();
                break;
            case 'pingpongdelay':
                this.effectInstances![module.name].instance = new Tone.PingPongDelay();
                break;
            case 'pitchshift':
                this.effectInstances![module.name].instance = new Tone.PitchShift();
                break;
            case 'stereowidener':
                this.effectInstances![module.name].instance = new Tone.StereoWidener();
                break;
            case 'tremolo':
                this.effectInstances![module.name].instance = new Tone.Tremolo();
                break;
            case 'vibrato':
                this.effectInstances![module.name].instance = new Tone.Vibrato();
                break;
            case 'wah':
                this.effectInstances![module.name].instance = new Tone.AutoWah();
                break;
        }
    }

    enableEffectInstance(module: FXModule<any>) {
        console.log('EFFECT enabled', module.name);

        this.rewire();

        this.effectInstances![module.name].enabled = true;
    }

    disableEffectInstance(module: FXModule<any>) {
        console.log('EFFECT disabled', module.name);

        this.rewire();

        this.effectInstances![module.name].enabled = false;
    }

    getModuleInstanceByName(moduleName: string): any {
        return this.effectInstances![moduleName].instance;
    }

    getEnabledModulesSorted() {
        const keys = Object.keys(this.options!.modules!);
        const modulesSorted: Array<FXModule<any>> = [];

        for (let i = 0; i < keys.length; i++) {
            const currentModule = this.options?.modules![i] as FXModule<any>;
            modulesSorted[currentModule.index] = currentModule;
        }

        const modulesSortedEnabled = [];

        for (let i = 0; i < modulesSorted.length; i++) {
            if (modulesSorted[i] && modulesSorted[i].enabled) {
                modulesSortedEnabled.push(modulesSorted[i]);
            }
        }
        return modulesSortedEnabled;
    }

    rewire() {
        this.wires.forEach((connection) => {
            if (connection[0] && connection[1]) {
                connection[0].disconnect(connection[1]);
            }
        });

        const modulesSorted = this.getEnabledModulesSorted();
        console.log('[EffectRack] rewire(), enabledModulesSorted', modulesSorted);
        const keys = Object.keys(modulesSorted);

        // clear wires
        this.wires = [];

        // connect all in the right order
        for (let i = 0; i < keys.length; i++) {
            const module = modulesSorted[i];
            let source;
            let target;

            if (!this.effectInstances![module.name].instance) {
                this.createEffectInstance(module);
            }
            if (i === 0) {
                // first node
                source = this.inputGainNode;
                target = this.getModuleInstanceByName(module.name);

                source.connect(target);
                this.wires.push([source, target]);

                console.log('[EffectRack] Wire start inputGainNode ->', module.name);
            } else {
                // middle or last node
                source = this.getModuleInstanceByName(modulesSorted[i - 1].name);
                target = this.getModuleInstanceByName(module.name);
                source.connect(target);
                this.wires.push([source, target]);
                console.log('[EffectRack] Wire: ', modulesSorted[i - 1].name, ' -> ', module.name);
            }

            if (i === keys.length - 1) {
                // last node
                source = this.getModuleInstanceByName(module.name);
                target = this.gainNode;
                source.connect(target);
                console.log('[EffectRack] Wire end: ', module.name, ' -> Tone.destination');
                this.wires.push([source, target]);
            }
        }
        console.log('[EffectRack] Rewired.');
    }

    enable() {
        if (this.getEnabledModulesSorted().length === 0) {
            console.log('[EffectRack] Enabled. Routing input -> {effect chain} -> output');
            this.gainNode.disconnect();
            this.gainNode.chain(this.destination);
            this.onAfterEnabled();
        }
    }

    disable() {
        console.log('[EffectRack] Disabled. Routing input -> output');
        this.gainNode.disconnect();
        this.inputGainNode.chain(this.gainNode, this.destination);
        this.onAfterDisabled();
    }

    set(options: EffectRackOptions) {
        super.set(options);

        this.options = options;

        console.log('EffectRack options modules', options.modules);

        if (!this.effectInstances) {
            this.effectInstances = {};
            options.modules?.forEach((module) => {
                this.effectInstances![module.name] = {
                    index: module.index,
                    enabled: undefined,
                    instance: undefined,
                };
            });
        }

        this.disable();

        options.modules?.forEach((module) => {
            // update index (after rewire)
            this.effectInstances![module.name].index = module.index;

            if (module.enabled === true) {
                // user enabled module (undefined or false)
                if (!this.effectInstances![module.name].enabled) {
                    this.enableEffectInstance(module);
                }
            } else {
                // user disabled module
                if (this.effectInstances![module.name].enabled === true) {
                    this.disableEffectInstance(module);
                }
            }
        });

        this.enable();
    }
}
