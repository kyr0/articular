import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

export const getClasses = makeStyles(({ palette }: Theme) => ({
    root: {
        borderBottomWidth: 2,
        borderBottomStyle: 'solid',
        borderBottomColor: palette.primary.dark,
        backgroundColor: palette.primary.main,
    },
}));
