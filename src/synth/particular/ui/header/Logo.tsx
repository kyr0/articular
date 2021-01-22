import Typography from '@material-ui/core/Typography';
import React from 'react';
import { getClasses } from './Logo.jss';

export const Logo = () => {
    const classes = getClasses();

    return (
        <div className={classes.root}>
            <Typography className={classes.logoText}>
                🔊 <strong>ART</strong>ICULAR
            </Typography>
            <Typography className={classes.logoSlogan}>
                POLYPHONIC WEB SYNTH
                <br />
                v0.0.0-alpha1
            </Typography>
        </div>
    );
};
