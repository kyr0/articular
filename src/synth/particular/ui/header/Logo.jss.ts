import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

export const getClasses = makeStyles(({ palette }: Theme) => ({
    root: {
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: palette.primary.dark,
    },
    logoText: {
        fontWeight: 200,
    },
    logoSlogan: {
        fontSize: '0.5rem',
    },
}));
