export const debounce = <T>(fn: any, ms: number): T => {
    let timeout: any;

    return (function (...rest: any) {
        const delegate = () => fn(...rest);

        clearTimeout(timeout);
        timeout = setTimeout(delegate, ms);
    } as unknown) as T;
};
