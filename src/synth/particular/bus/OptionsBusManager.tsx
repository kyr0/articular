import React from 'react';
import { createContext, PropsWithChildren, useContext } from 'react';
import { RecursivePartial } from 'tone/build/esm/core/util/Interface';
import { ArticularOptions } from '../synth/interface/ArticularOptions';
import { TinyEventBus } from './TinyEventBus';

export const EVENT_OPTIONS_CHANGED = 'EVENT_OPTIONS_CHANGED';

export const OptionsBusContext = createContext(new TinyEventBus<RecursivePartial<ArticularOptions>>());

export const OptionsBusManager = ({ children }: PropsWithChildren<any>) => {
    const optionsEventBus = useContext(OptionsBusContext);

    return <OptionsBusContext.Provider value={optionsEventBus}>{children}</OptionsBusContext.Provider>;
};
