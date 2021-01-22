import { SignalName } from './SignalName';
import * as Tone from 'tone';

export interface Modulatable {
    getSignal(signalId: string): Tone.Signal;
    getSignalNames(): Array<SignalName>;
}
