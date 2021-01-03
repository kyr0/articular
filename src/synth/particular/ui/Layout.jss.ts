import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

export const getClasses = makeStyles(({ palette }: Theme) => ({
    root: {
        backgroundColor: palette.background.default,
    },

    container: {
        display: 'flex',
        flexDirection: 'column',
    },
}));
