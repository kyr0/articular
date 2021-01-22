import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

export const getClasses = makeStyles(({ palette }: Theme) => ({
    root: {
        display: 'flex',
    },
    waveFormDesignerModal: {
        overflow: 'auto',
        maxWidth: '60vw',
        minWidth: 800,
        maxHeight: '60vh',
        minHeight: 600,
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.9)',
        border: '2px solid rgba(255,255,255,0.9)',
    },
    tab: {
        width: 40,
        marginRight: 10,
        minWidth: 30,
        paddingTop: 0,
        paddingBottom: 0,
        minHeight: 40,
        maxHeight: 40,
        borderRadius: 10,
    },

    tabBar: {
        marginLeft: -15,
        width: 'calc(100% + 30px)',
        backgroundColor: '#000',
        '& .MuiTabs-root': {
            minHeight: 40,
            maxHeight: 40,
        },
        '& .MuiTabs-indicator': {
            display: 'none',
        },
        '& .MuiButtonBase-root': {
            borderRadius: 20,
        },
    },

    tabPanel: {
        marginLeft: -15,
        paddingTop: 15,
    },

    avatar: {
        color: '#fff',
    },
    removeButton: {
        marginTop: -4,
    },
    addButton: {
        marginLeft: -10,
    },
}));
