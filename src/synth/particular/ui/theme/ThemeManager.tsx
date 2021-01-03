import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import React, { PropsWithChildren, useState } from "react";
import useEffectOnce from "react-use/lib/useEffectOnce";
import { defaultDarkTheme } from "./defaultDarkTheme";
import { defaultLightTheme } from "./defaultLightTheme";

export const ThemeManager = ({ children }: PropsWithChildren<any>) => {

    const [theme, setTheme] = useState(createMuiTheme(defaultLightTheme));

    useEffectOnce(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme(createMuiTheme(defaultDarkTheme));
        } else {
            setTheme(createMuiTheme(defaultLightTheme));
        }
    })

    return <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>
}