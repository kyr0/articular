import * as Tone from 'tone';
import { mergeOptions } from '../function/mergeOptions';
import { MasterFilterOptions } from '../interface/MasterFilterOptions';
import { SignalName } from '../interface/SignalName';
import { AbstractModule } from './AbstractModule';

export enum MasterFilerSignals {
    CUTOFF = 'frequency',
    RES = 'Q',
}

export class MasterFilter extends AbstractModule<MasterFilterOptions> {
    readonly gainNode = new Tone.Gain();
    readonly toneNode = new Tone.Filter();
    readonly inputGainNode = new Tone.Gain();
    protected amountNode = new Tone.Add();
    protected cutoffSignal = new Tone.Signal();

    enable() {
        //console.log('[MasterFilter] Enabled. Routing input -> filter -> destination');
        this.inputGainNode.disconnect();
        this.cutoffSignal.connect(this.amountNode);
        this.amountNode.connect(this.toneNode.frequency);
        this.inputGainNode.chain(this.toneNode, this.destination);
        this.onAfterEnabled();
    }

    getSignal(signalId: string): Tone.Signal {
        if (signalId === 'frequency') {
            console.log('-> frequency amountNode');
            return this.amountNode;
        } else {
            return new Tone.Signal().connect((this.toneNode as any)[signalId]);
        }
    }

    getSignalNames(): Array<SignalName> {
        return [
            {
                id: 'frequency',
                label: 'Cutoff',
                description: 'Cutoff frequency the filter shapes the output sound with',
            },
            {
                id: 'Q',
                label: 'Res',
                description: 'Resonance level the filter pumps with at the cutoff frequency',
            },
        ];
    }

    disable() {
        //console.log('[MasterFilter] Disabled. Routing input -> output');
        // initial loading case
        if (this.isEnabled) {
            this.inputGainNode.disconnect();
            this.cutoffSignal.disconnect(this.amountNode);
            this.amountNode.disconnect(this.toneNode.frequency);
            this.inputGainNode.chain(this.destination);
            this.onAfterDisabled();
        } else {
            this.inputGainNode.chain(this.destination);
        }
    }

    getOptions(options: MasterFilterOptions) {
        const _options = mergeOptions(this.options, options);

        if (_options) {
            console.log('got config options MASTERFILTER', _options);
            _options.Q = _options.resonance;
            //_options.frequency = _options.cutoff;
            _options.gain = _options.drive;

            this.cutoffSignal.rampTo(_options.cutoff as number, 0.1);
        }
        return _options;
    }
}
