import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

export const getClasses = makeStyles(({ palette }: Theme) => ({
    smallCaption: {
        fontSize: '0.5rem',
    },

    paper: {
        backgroundColor: palette.background.default,
        width: '100%',
        background: 'linear-gradient(180deg, rgba(2,0,36,0) 0%, rgba(0,0,0,0.1) 100%)',
        border: `2px solid rgba(255,255,255,0.1)`,
    },

    waveformSelector: {
        height: 30,
        marginBottom: 5,
    },

    routing: {
        transform: 'scale(0.6)',
        height: 35,
        '& > label': {
            marginTop: -12,
        },
    },

    width100: {
        width: '100%',
    },

    moduleHeader: {
        display: 'flex',
        flexDirection: 'row',
        height: 35,
    },

    moduleHeaderContainer: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        marginBottom: 5,
    },

    smallCheckbox: {
        padding: 3,
        transform: 'scale(0.75)',
    },

    shiftRight: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    smallSlider: {
        padding: 0,
        paddingTop: 5,
        paddingBottom: 10,
    },
    smallNumberField: {
        width: 35,
        '& > div > fieldset': {
            padding: 4,
        },
        '& > div > fieldset > legend': {
            width: 20,
        },
        '& > label': {
            fontSize: '0.8rem',
            lineHeight: '1.1rem',
            marginLeft: -6,
        },
        '& > div > input': {
            transform: 'scale(0.8)',
            paddingRight: '0px !important',
            paddingLeft: '3px !important',
            paddingTop: '12px !important',
            paddingBottom: '12px !important',
        },
    },
    moduleHeaderText: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: 38,
    },

    moduleHeaderTypography: {
        fontSize: '0.9rem',
    },
    marginAuto: {
        margin: 'auto',
    },
    knob: {
        width: 35,
        height: 35,
        margin: 'auto',
        '& text': {
            fontSize: 60,
        },
    },
    smallText: {
        fontSize: '0.6rem',
    },
    centerContents: {
        display: 'flex',
        justifyContent: 'center',
        margin: 'auto',
    },

    detuneField: {
        width: '60px !important',
        marginLeft: 10,
        '& > div > input': {
            width: 60,
        },
    },
    moduleHeaderActions: {
        paddingRight: 8,
        paddingTop: 8,
    },

    smallSelect: {
        height: 25,
        fontSize: '0.8rem',
    },
}));
