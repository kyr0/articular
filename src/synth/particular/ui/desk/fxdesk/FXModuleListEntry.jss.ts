import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

export const getClasses = makeStyles(({ palette }: Theme) => ({
    fxModule: {
        marginBottom: 5,
    },
    flexLeft: {
        display: 'flex',
        justifyContent: 'left',
    },
}));
