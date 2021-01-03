import NOTES from '../constants/NOTES';

export const isAccidentalNote = (note: any) => {
    return NOTES.includes(note) && note.includes('#');
};
