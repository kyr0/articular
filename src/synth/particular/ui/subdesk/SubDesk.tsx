import { Typography } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React, { useCallback, useContext } from 'react';
import { OptionsBusContext } from '../../bus/OptionsBusManager';
import { OptionsContext } from '../../Particular';
import { LFO } from './lfo/LFO';
import { getClasses } from './SubDesk.jss';
import { Voicing } from './voicing/Voicing';

export const SubDesk = () => {
    const classes = getClasses();

    const optionsContext = useContext(OptionsContext);
    const optionsBusContext = useContext(OptionsBusContext);

    return (
        <div className={classes.root}>
            <Grid container spacing={1}>
                <Grid item xs={3}></Grid>
                <Grid item xs={2}>
                    <LFO lfoName="lfo1" />
                </Grid>
                <Grid item xs={2}>
                    <LFO lfoName="lfo2" />
                </Grid>
                <Grid item xs={2}>
                    <LFO lfoName="lfo3" />
                </Grid>
                <Grid item xs={2}>
                    <LFO lfoName="lfo4" />
                </Grid>
                <Grid item xs={1}>
                    <Voicing />
                </Grid>
            </Grid>
        </div>
    );
};
