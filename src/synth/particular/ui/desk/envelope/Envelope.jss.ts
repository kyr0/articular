import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

export const getClasses = makeStyles(({ palette }: Theme) => ({
    root: {
        display: 'flex',
        width: '100%',
    },

    LineChart: {
        position: 'relative',
    },
    tab: {
        minWidth: '16.66%',
        paddingTop: 0,
        paddingBottom: 0,
        minHeight: 40,
        maxHeight: 40,
    },

    tabBar: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        '& .MuiTabs-root': {
            minHeight: 40,
            maxHeight: 40,
        },
    },

    svg: {
        fill: 'none',
        stroke: '#33C7FF',
        display: 'block',
        strokeWidth: '2px',
    },
}));
