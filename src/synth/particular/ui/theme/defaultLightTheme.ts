export const defaultLightTheme = {
    palette: {
        type: 'light',
        primary: {
            light: '#757ce8',
            main: '#3f50b5',
            dark: '#002884',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff7961',
            main: '#f44336',
            dark: '#ba000d',
            contrastText: '#000',
        },
    },
    typography: {
        root: {
            color: '#eceff1',
        },
        fontFamily: ['Alegreya Sans', 'sans-serif'].join(','),

        fontFamilyLinks: [
            'https://fonts.googleapis.com/css2?family=Alegreya+Sans:ital,wght@0,100;0,300;0,400;0,500;0,700;0,800;0,900;1,100;1,300;1,400;1,500;1,700;1,800;1,900&display=swap',
        ],
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                body: {
                    backgroundColor: '#cfd8dc',
                },
            },
        },
    },
} as any;
