import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

export const getClasses = makeStyles((theme: Theme) => ({
    root: {},

    pianoContainer: {
        display: 'flex',
    },

    pianoBrand: {
        position: 'absolute',
        top: -20,
        width: '100%',
        justifyContent: 'center',
        display: 'flex',
        margin: 'auto',
        lineHeight: '0.8rem',
        fontSize: '0.7rem',
    },

    container: {
        display: 'inline-flex',
        boxSizing: 'border-box',
        borderTop: '25px solid #ed5276',
        position: 'relative',
        userSelect: 'none',
        height: 120,
        borderRadius: 5,
        textShadow: '0px 0px 9px #000',
        margin: 'auto',
        '&::after': {
            content: '""',
            width: '100%',
            height: '5px',
            backgroundColor: 'rgba(68, 68, 68, 0.1)',
            position: 'absolute',
            top: 0,
        },
    },

    accidentialKeyWrapper: {
        position: 'relative',
        width: 0,
    },

    accidentialKey: {
        position: 'absolute',
        transform: 'translateX(-50%)',
        cursor: 'pointer',
        background: '#444',
        boxShadow: '0px 2px 10px -1px #333',
        width: 18,
        marginTop: -4,
        height: 60,
        borderRadius: '0px 0px 3px 3px',
        border: '3px solid #333',
        borderBottom: '6px solid #333',
        borderTop: 'none',
        boxSizing: 'border-box',
        padding: 5,
        outline: 'none',
        color: '#dbdbdb',
    },

    accidentialKeyPlaying: {
        background: '#444',
        color: '#fff',
        marginTop: -2,
    },

    naturalKey: {
        cursor: 'pointer',
        background: '#fafafa',
        width: 25,
        height: 90,
        marginLeft: 1,
        marginRight: 1,
        marginTop: -2,
        borderRadius: '0 0 3px 3px',
        boxShadow: '0px 10px 12px -16px #000000',
        padding: 10,
        outline: 'none',
        border: '2px solid #efefef',
        borderBottom: '5px solid #ddd',
        boxSizing: 'border-box',
        color: '#444',
        '&:first-of-type': {
            marginLeft: 0,
        },
        '&:last-of-type': {
            marginRight: 0,
        },
    },

    naturalKeyPlaying: {
        borderBottom: '5px solid #ed5276',
        color: '#ed5276',
        marginTop: 0,
    },

    text: {
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        fontSize: '0.8rem',
    },

    textKey: {
        pointerEvents: 'none',
        display: 'flex',
        color: '#ccc',
        marginTop: 50,
        justifyContent: 'center',
        fontSize: '0.5rem',
    },

    accidentialText: {
        pointerEvents: 'none',
        display: 'flex',
        marginTop: 'auto',
        justifyContent: 'center',
        fontSize: '0.7rem',
    },

    accidentialTextKey: {
        pointerEvents: 'none',
        display: 'flex',
        color: '#ddd',
        marginTop: 27,
        justifyContent: 'center',
        fontSize: '0.4rem',
    },
}));
