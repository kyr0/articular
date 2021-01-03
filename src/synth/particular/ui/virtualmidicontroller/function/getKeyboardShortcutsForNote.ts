export const getKeyboardShortcutsForNote = (keyboardMap: any, note: any) => {
    const keyboardShortcuts = Object.keys(keyboardMap);
    return keyboardShortcuts.filter((shortcut) => keyboardMap[shortcut] === note);
};
