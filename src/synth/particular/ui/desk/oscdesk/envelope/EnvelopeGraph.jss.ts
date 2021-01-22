import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

export const getClasses = makeStyles(({ palette }: Theme) => ({
    root: {
        display: 'flex',
        width: '100%',
    },

    lineChart: {
        position: 'relative',
    },

    svg: {
        fill: 'none',
        stroke: '#33C7FF',
        display: 'block',
        strokeWidth: '2px',
    },
}));
