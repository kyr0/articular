export const isRegularKey = (event: KeyboardEvent) => {
    return !event.ctrlKey && !event.metaKey && !event.shiftKey;
};
