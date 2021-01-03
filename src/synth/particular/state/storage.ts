export type PersistMode = 'LOCAL' | 'SESSION' | 'NONE';

const getStorageApi = (mode: PersistMode) => {
    switch (mode) {
        case 'NONE':
            return {
                getItem: () => undefined,
                setItem: () => undefined,
            };
        case 'LOCAL':
            return window.localStorage;
        case 'SESSION':
            return window.sessionStorage;
    }
};

export const persist = (namespace: string, key: string, data: any, mode: PersistMode = 'LOCAL') => {
    getStorageApi(mode).setItem(`${namespace}-${key}`, JSON.stringify(data));
};

export const restore = (namespace: string, key: string, defaultValue: any = {}, mode: PersistMode = 'LOCAL') => {
    const jsonRawData = getStorageApi(mode).getItem(`${namespace}-${key}`);
    if (jsonRawData) {
        return JSON.parse(jsonRawData);
    }
    return defaultValue;
};
