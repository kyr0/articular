import NOTES from '../constants/NOTES';

export const getNotesBetween = (startNote: any, endNote: any) => {
    const startingIndex = NOTES.indexOf(startNote);
    const endingIndex = NOTES.indexOf(endNote);
    return NOTES.slice(startingIndex, endingIndex + 1);
};
