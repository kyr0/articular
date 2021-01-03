import { debounce, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React, { useCallback, useContext, useState } from 'react';
import { OptionsBusContext } from '../../../bus/OptionsBusManager';
import { OptionsContext } from '../../../Particular';
import { getClasses } from './Voicing.jss';
import { getClasses as getUiClasses } from '../../UI.jss';
import { useSyncConfig } from '../../hook/useSyncConfig';
import * as skins from 'react-rotary-knob-skin-pack';
import { Knob } from 'react-rotary-knob';
import Paper from '@material-ui/core/Paper';

export const Voicing = () => {
    const uiClasses = getUiClasses();

    const optionsContext = useContext(OptionsContext);
    const optionsBusContext = useContext(OptionsBusContext);

    const onSetDebounced = useCallback(
        (param: string, debounceTime: number, childKey?: string) =>
            debounce((value: any) => {
                useSyncConfig(optionsBusContext, 'voicing', param, value, childKey);
            }, debounceTime),
        [optionsBusContext],
    );

    // === GLIDE

    const [glide, setGlide] = useState(optionsContext!.voicing.glide! || 0.1);
    const syncGlide = onSetDebounced('glide', 1);

    const onGlideChange = useCallback(
        () => (glide: number) => {
            setGlide(glide / 1000);
            syncGlide(glide / 1000);
        },
        [setGlide],
    );

    return (
        <Paper elevation={3} className={uiClasses.paper}>
            <Grid container>
                <Grid container className={uiClasses.moduleHeaderContainer}>
                    <Grid item xs={12} className={uiClasses.moduleHeader}>
                        <Typography variant="button" className={uiClasses.moduleHeaderText}>
                            {' '}
                            &nbsp; VOICING
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item xs={12}>
                        <Knob
                            unlockDistance={0}
                            preciseMode={true}
                            defaultValue={glide * 1000}
                            min={0}
                            step={1}
                            skin={skins.s9}
                            max={1000}
                            className={uiClasses.knob}
                            value={glide * 1000}
                            onChange={onGlideChange()}
                            rotateDegrees={180}
                            style={{
                                width: '35px',
                                height: '35px',
                            }}
                        />
                        <Typography variant="caption" className={uiClasses.smallCaption}>
                            GLIDE
                        </Typography>
                        <br />
                        {glide.toFixed(2)} sec
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};
