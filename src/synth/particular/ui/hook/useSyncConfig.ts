import { useContext } from 'react';
import { EVENT_OPTIONS_CHANGED, OptionsBusContext } from '../../bus/OptionsBusManager';
import { TinyEventBus } from '../../bus/TinyEventBus';

export const useSyncConfig = (
    optionsBusContext: TinyEventBus<any>,
    oscName: string,
    param: string,
    value: any,
    childKey?: string,
) => {
    const configObject = {
        [oscName]: {
            [param]: value,
        },
    };

    if (childKey) {
        delete configObject[oscName][param];

        configObject[oscName] = {
            [childKey]: {
                [param]: value,
            },
        };
    }
    optionsBusContext.publish(EVENT_OPTIONS_CHANGED, configObject);
};
