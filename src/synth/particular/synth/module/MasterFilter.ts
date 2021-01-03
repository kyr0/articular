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
    readonly toneNode = new Tone.Filter();
    readonly inputGainNode = new Tone.Gain();

    enable() {
        //console.log('[MasterFilter] Enabled. Routing input -> filter -> destination');
        this.inputGainNode.disconnect();
        this.inputGainNode.chain(this.toneNode, this.destination);
        this.onAfterEnabled();
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
        this.inputGainNode.disconnect();
        this.inputGainNode.chain(this.destination);
        this.onAfterDisabled();
    }

    getOptions(options: MasterFilterOptions) {
        const _options = mergeOptions(this.options, options);

        if (_options) {
            _options.Q = _options.resonance;
            _options.frequency = _options.cutoff;
            _options.gain = _options.drive;
        }
        return _options;
    }
}
