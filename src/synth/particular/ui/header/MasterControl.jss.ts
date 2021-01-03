import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

export const getClasses = makeStyles((theme: Theme) => ({
    root: {
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'center',
        marginRight: 10,
    },
}));
