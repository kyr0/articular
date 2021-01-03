import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

export const getClasses = makeStyles((theme: Theme) => ({
    root: {
        flexDirection: 'row',
        display: 'flex',
        minWidth: 100,
    },

    presetField: {
        width: '100%',
        margin: 10,
        '& .MuiFormControl-root, & .MuiInputBase-root': {
            height: '100%',
        },
    },
}));
