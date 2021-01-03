import * as Tone from 'tone';
import { EffectRackOptions } from '../interface/EffectRackOptions';
import { AbstractModule } from './AbstractModule';

export class EffectRack extends AbstractModule<EffectRackOptions> {
    readonly inputGainNode = new Tone.Gain();

    effectInstances: Array<any> = [];

    createEffectInstance() {
        //
    }

    enable() {
        console.log('[EffectRack] Enabled. Routing input -> {effect chain} -> output');
        this.inputGainNode.disconnect();

        this.inputGainNode.chain(this.destination);

        // TODO: Implement: create effect instances
        // TODO: Connect inputGainNode -> effect gain
        // TODO: effect inputGainNode -> next effect gainNode
        // TODO: last effect gainNode -> gainNode

        // chain route input to first effect,
        // effect to next effect,
        // last effect to output
        /*
        for (let i=0; i<this.options?.effects?.length; i++) {

            if (i === 0) {
                this.inputGainNode.chain(options.effects[0].);
            }
        }
        */
        this.onAfterEnabled();
    }

    disable() {
        console.log('[EffectRack] Disabled. Routing input -> output');
        this.inputGainNode.disconnect();
        this.inputGainNode.chain(this.destination);
        this.onAfterDisabled();
    }
}
