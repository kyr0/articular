export const defaultDarkTheme = {
    palette: {
        type: 'dark',
        background: {
            default: '#263238',
        },
        primary: {
            light: '#b0bec5',
            main: '#546e7a',
            dark: '#37474f',
            contrastText: '#fff',
        },
        secondary: {
            light: '#eeeeee',
            main: '#bdbdbd',
            dark: '#424242',
            contrastText: '#fff',
        },
    },
    typography: {
        allVariants: {
            color: '#eceff1',
        },
        fontFamily: ['Alegreya Sans', 'sans-serif'].join(','),

        fontFamilyLinks: [
            'https://fonts.googleapis.com/css2?family=Alegreya+Sans:ital,wght@0,100;0,300;0,400;0,500;0,700;0,800;0,900;1,100;1,300;1,400;1,500;1,700;1,800;1,900&display=swap',
        ],
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {},
        },
    },
} as any;
