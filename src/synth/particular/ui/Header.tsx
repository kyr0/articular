import Grid from '@material-ui/core/Grid';
import React from 'react';
import { getClasses } from './Header.jss';
import { Actions } from './header/Actions';
import { DeskSelector } from './header/DeskSelector';
import { Logo } from './header/Logo';
import { MasterControl } from './header/MasterControl';
import { PresetSelector } from './header/PresetSelector';

export const Header = () => {
    const classes = getClasses();

    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item xs={2}>
                    <Logo />
                </Grid>
                <Grid item xs={5}>
                    <DeskSelector />
                </Grid>
                <Grid item xs={3}>
                    <PresetSelector />
                </Grid>
                <Grid item xs={1}>
                    <Actions />
                </Grid>
                <Grid item xs={1}>
                    <MasterControl />
                </Grid>
            </Grid>
        </div>
    );
};
