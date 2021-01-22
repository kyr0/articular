import React from 'react';
import { createContext, PropsWithChildren, useContext } from 'react';
import { Desk } from '../ui/header/DeskSelector';
import { TinyEventBus } from './TinyEventBus';

export const DESK_CHANGE = 'DESK_CHANGE';

export interface DeskChangeEvent {
    desk: Desk;
}
export const UIBusContext = createContext(new TinyEventBus<DeskChangeEvent>());

export const UIBusManager = ({ children }: PropsWithChildren<any>) => {
    const uiEventBus = useContext(UIBusContext);

    return <UIBusContext.Provider value={uiEventBus}>{children}</UIBusContext.Provider>;
};
