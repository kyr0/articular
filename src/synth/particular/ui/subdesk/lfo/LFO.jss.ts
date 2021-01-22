import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

export const getClasses = makeStyles(({ palette }: Theme) => ({
    root: {
        display: 'flex',
        width: '100%',
    },

    dragLink: {
        cursor: 'move',
    },

    lfoDropTarget: {
        cursor: 'alias',
        marginRight: 5,
    },
}));
