import React, { createContext, useContext, useState } from 'react';
import useEffectOnce from 'react-use/lib/useEffectOnce';
import { EVENT_OPTIONS_CHANGED, OptionsBusContext, OptionsBusManager } from './bus/OptionsBusManager';
import { UI } from './ui/UI';
import { Articular } from './synth/Articular';
import { ArticularOptions } from './synth/interface/ArticularOptions';
import { RecursivePartial } from './synth/interface/RecursivePartial';
import useLatest from 'react-use/lib/useLatest';
import {
    EVENT_SIGNAL_CONNECT,
    EVENT_SIGNAL_DISCONNECT,
    SignalsBusContext,
    SignalsBusManager,
} from './bus/SignalsBusManager';
import { SignalRoute } from './synth/interface/SignalRoute';
import { EVENT_NOTE_OFF, EVENT_NOTE_ON, NoteBusContext } from './bus/NoteBusManager';
import { Note } from './synth/interface/Note';

import * as Tone from 'tone';
import { sign } from 'crypto';
import { ToneConstantSource } from 'tone/build/esm/signal/ToneConstantSource';
import { useUpdate } from 'react-use';

export interface ParticularState {
    masterVolume: number;
}

export interface ParticularProps {
    instanceId: string;
    enableDirectMidiInput?: boolean;
    enableDirectKeyboardInput?: boolean;
    enableStandalonePersistency?: boolean;
    isConnected?: boolean;
    state?: ParticularState;
    presetId?: string;
}

export const InstanceIdContext = createContext(Date.now().toFixed());
export const OptionsContext = createContext<ArticularOptions | undefined>(undefined);
export const ArticularContext = createContext<Articular | undefined>(undefined);

export const Particular = ({
    enableDirectMidiInput = true,
    enableStandalonePersistency = true,
    enableDirectKeyboardInput = false,
    isConnected = true,
    presetId = 'init',
    instanceId,
}: ParticularProps): any => {
    const optionsBusContext = useContext(OptionsBusContext);
    const signalsBusContext = useContext(SignalsBusContext);
    const noteBusContext = useContext(NoteBusContext);
    const [articular, setArticular] = useState<Articular | undefined>();
    const latestArticular = useLatest(articular);
    const [articularOptions, setArticularOptions] = useState<ArticularOptions | undefined>();

    useEffectOnce(() => {
        // create an instance of the synth backend
        const localArticular = new Articular(enableDirectMidiInput, enableDirectKeyboardInput, isConnected, presetId);
        setArticular(localArticular);

        const options = localArticular.getCurrentPreset()?.options;
        setArticularOptions(options);

        if (options?.matrix && options?.matrix.routes.length) {
            options?.matrix.routes.forEach((route: RecursivePartial<SignalRoute>) => {
                localArticular.addSignalRoute(route as SignalRoute, true);
            });
        }
    });

    useEffectOnce(() => {
        optionsBusContext.subscribe(EVENT_OPTIONS_CHANGED, (options: RecursivePartial<ArticularOptions>) => {
            if (latestArticular.current) {
                latestArticular.current.set(options as ArticularOptions); // sync synth backend state
                setArticularOptions(latestArticular.current.get()); // sync local UI state
                //console.log('ARTICULAR CONFIG', JSON.stringify(latestArticular.current.get(), null, 4));
            }
        });

        signalsBusContext.subscribe(EVENT_SIGNAL_CONNECT, (signalRoute: SignalRoute) => {
            if (latestArticular.current) {
                latestArticular.current.addSignalRoute(signalRoute); // sync synth backend state
                setArticularOptions(latestArticular.current.get()); // sync local UI state
                // console.log('ARTICULAR CONFIG', JSON.stringify(latestArticular.current.get(), null, 4));
            }
        });

        signalsBusContext.subscribe(EVENT_SIGNAL_DISCONNECT, (signalRoute: SignalRoute) => {
            if (latestArticular.current) {
                latestArticular.current.removeSignalRoute(signalRoute); // sync synth backend state
                setArticularOptions(latestArticular.current.get()); // sync local UI state

                // console.log('ARTICULAR CONFIG', JSON.stringify(latestArticular.current.get(), null, 4));
            }
        });

        noteBusContext.subscribe(EVENT_NOTE_ON, (note: Note) => {
            if (latestArticular.current) {
                console.log('note on', note);
                latestArticular.current.noteOn(note);
            }
        });

        noteBusContext.subscribe(EVENT_NOTE_OFF, (note: Note) => {
            if (latestArticular.current) {
                console.log('note off', note);
                latestArticular.current.noteOff(note);
            }
        });
    });

    return (
        <>
            {articular && (
                <InstanceIdContext.Provider value={instanceId}>
                    <OptionsBusManager>
                        <SignalsBusManager>
                            <OptionsContext.Provider value={articularOptions}>
                                <ArticularContext.Provider value={articular}>
                                    <UI />
                                </ArticularContext.Provider>
                            </OptionsContext.Provider>
                        </SignalsBusManager>
                    </OptionsBusManager>
                </InstanceIdContext.Provider>
            )}
        </>
    );
};
