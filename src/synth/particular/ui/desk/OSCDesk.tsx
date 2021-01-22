import Grid from '@material-ui/core/Grid';
import React, { memo } from 'react';
import { PolySynth } from './oscdesk/autofilterpolysynth/PolySynth';
import { getClasses } from './OSCDesk.jss';
import { getClasses as getUiClasses } from '../UI.jss';
import { MasterFilter } from './oscdesk/masterfilter/MasterFilter';
import { Sub } from './oscdesk/sub/Sub';
import { Noise } from './oscdesk/noise/Noise';
import { Envelope } from './oscdesk/envelope/Envelope';
import { Pluck } from './oscdesk/pluck/Pluck';

export const OSCDesk = memo(() => {
    const classes = getClasses();
    const uiClasses = getUiClasses();

    return (
        <div className={classes.root}>
            <Grid container spacing={1}>
                <Grid item xs={3}>
                    <div>
                        <Sub />
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <Noise />
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <Pluck />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <PolySynth oscName="oscA" />
                </Grid>
                <Grid item xs={3}>
                    <PolySynth oscName="oscB" />
                </Grid>
                <Grid item xs={3}>
                    <div>
                        <MasterFilter />
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <Envelope />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
});
