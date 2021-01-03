import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

export const getClasses = makeStyles((theme: Theme) => ({
    root: {
        flexDirection: 'row',
    },
    tab: {
        minWidth: '25%',
    },
}));
