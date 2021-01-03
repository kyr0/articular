import React from 'react';
import { createContext, PropsWithChildren, useContext } from 'react';
import { SignalRoute } from '../synth/interface/SignalRoute';
import { TinyEventBus } from './TinyEventBus';

export const EVENT_SIGNAL_CONNECT = 'EVENT_SIGNAL_CONNECT';
export const EVENT_SIGNAL_DISCONNECT = 'EVENT_SIGNAL_DISCONNECT';

export const SignalsBusContext = createContext(new TinyEventBus<SignalRoute>());

export const SignalsBusManager = ({ children }: PropsWithChildren<any>) => {
    const signalsEventBus = useContext(SignalsBusContext);

    return <SignalsBusContext.Provider value={signalsEventBus}>{children}</SignalsBusContext.Provider>;
};
