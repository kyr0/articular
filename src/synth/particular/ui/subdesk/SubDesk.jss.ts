
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

export const getClasses = makeStyles(({ palette }: Theme) => ({
    root: {
        backgroundColor: palette.background.default,
        margin: 5
    },
    paper: {
        backgroundColor: palette.background.default,
    },
    moduleHeader: {
        display: 'flex',
        flexDirection: 'row'
    },
    moduleHeaderText: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    }
}))