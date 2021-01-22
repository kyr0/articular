import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

export const getClasses = makeStyles(({ palette }: Theme) => ({
    root: {
        display: 'flex',
    },
    sliderContainer: {
        paddingRight: 16,
        paddingLeft: 16,
        marginBottom: 2,
    },
    unisonField: {
        marginTop: 6,
        marginBottom: 4,
    },
    moduleationTypeRadios: {
        transform: 'scale(0.7)',
    },
    modulationTypeRadio: {
        paddingTop: 26,
        paddingBottom: 24,
        paddingLeft: 5,
        borderBottom: '5px solid rgba(255,255,255,0.1)',
    },
    modulationContainer: {
        paddingTop: 5,
        paddingBottom: 5,
        borderBottom: '3px solid rgba(255,255,255,0.1)',
        background: 'linear-gradient(90deg, rgba(2,0,36,0) 0%, rgba(0,0,0,0.2) 100%)',
    },
    modulationContainerTitle: {
        borderBottom: '3px solid rgba(255,255,255,0.1)',
    },
    waveformEditButton: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: 30,
        maxWidth: 30,
        minWidth: 30,
        height: 30,
        maxHeight: 30,
        minHeight: 30,
        padding: 0,
        '& .MuiTouchRipple-root': {
            left: 0,
        },
    },
    waveformContainer: {
        position: 'relative',
    },
    waveFormDesignerModal: {
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
}));
