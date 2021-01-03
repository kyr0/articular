import Grid from '@material-ui/core/Grid';
import React from 'react';
import { PolySynth } from './autofilterpolysynth/PolySynth';
import { getClasses } from './OSCDesk.jss';
import { getClasses as getUiClasses } from '../UI.jss';
import { MasterFilter } from './masterfilter/MasterFilter';
import { Sub } from './sub/Sub';
import { Noise } from './noise/Noise';
import { Metal } from './metal/Metal';
import { Envelope } from './envelope/Envelope';

export const OSCDesk = () => {
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
                        <Metal />
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
};
