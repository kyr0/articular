import { deepMerge } from 'tone/build/esm/core/util/Defaults';

export const mergeOptions = <T>(options: T, obtionsB: T): T => ({
    ...(options || {}),
    ...deepMerge(options || {}, obtionsB),
});
