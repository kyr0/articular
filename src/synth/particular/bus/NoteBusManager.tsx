import React, { createContext, PropsWithChildren, useContext } from 'react';
import { Note } from '../synth/interface/Note';
import { TinyEventBus } from './TinyEventBus';

export const EVENT_NOTE_ON = 'EVENT_NOTE_ON';
export const EVENT_NOTE_OFF = 'EVENT_NOTE_OFF';

export const NoteBusContext = createContext(new TinyEventBus<Note>());

export const NoteBusManager = ({ children }: PropsWithChildren<any>) => {
    const noteEventBus = useContext(NoteBusContext);

    return <NoteBusContext.Provider value={noteEventBus}>{children}</NoteBusContext.Provider>;
};
