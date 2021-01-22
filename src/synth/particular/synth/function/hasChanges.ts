import { deepDiff } from './deepDiff';

export const hasChanges = (objA: any, objB: any): boolean => {
    return Object.keys(deepDiff(objA, objB)).length > 0;
};
