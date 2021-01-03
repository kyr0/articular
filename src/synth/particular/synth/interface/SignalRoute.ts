import { Module } from './Module';
export type SignalSourceType = 'lfo'; // TODO: modWheel, pitchBend etc.

export interface SignalRoute {
    source: {
        type: SignalSourceType; // e.g. lfo
        id: string; // e.g. lfo1
    };
    target: {
        module: Module; // e.g. masterFilter
        signalId: string; // e.g. frequency
    };
}
