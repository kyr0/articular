import { debounce, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React, { useCallback, useContext, useState } from 'react';
import { OptionsBusContext } from '../../../bus/OptionsBusManager';
import { OptionsContext } from '../../../Particular';
import { getClasses } from './LFO.jss';
import { getClasses as getUiClasses } from '../../UI.jss';
import { useSyncConfig } from '../../hook/useSyncConfig';
import * as skins from 'react-rotary-knob-skin-pack';
import { Knob } from 'react-rotary-knob';
import Paper from '@material-ui/core/Paper';
import { useDrag } from 'react-dnd';
import TextField from '@material-ui/core/TextField';

export interface LFOProps {
    lfoName: string;
}

export const LFO = ({ lfoName }: LFOProps) => {
    const uiClasses = getUiClasses();
    const classes = getClasses();

    const optionsContext = useContext(OptionsContext);
    const optionsBusContext = useContext(OptionsBusContext);

    const onSetDebounced = useCallback(
        (param: string, debounceTime: number, childKey?: string) =>
            debounce((value: any) => {
                useSyncConfig(optionsBusContext, lfoName, param, value, childKey);
            }, debounceTime),
        [optionsBusContext],
    );

    // === FREQUENCY

    const [frequency, setFrequency] = useState(((optionsContext as any)![lfoName] as any).frequency! || 0.1);
    const syncFrequency = onSetDebounced('frequency', 1);

    const onFrequencyChange = useCallback(
        () => (frequency: number) => {
            setFrequency(frequency);
            syncFrequency(frequency);
        },
        [setFrequency],
    );

    // === MIN

    const [min, setMin] = useState(((optionsContext as any)![lfoName] as any).min! || 0.1);
    const syncMin = onSetDebounced('min', 1);

    const onMinChange = useCallback(
        () => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setMin(parseInt(event.target.value, 10) || 0);
            syncMin(parseInt(event.target.value, 10) || 0);
        },
        [setMin],
    );

    // === MAX

    const [max, setMax] = useState(((optionsContext as any)![lfoName] as any).max! || 0.1);
    const syncMax = onSetDebounced('max', 1);

    const onMaxChange = useCallback(
        () => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setMax(parseInt(event.target.value, 10) || 0);
            syncMax(parseInt(event.target.value, 10) || 0);
        },
        [setMax],
    );

    // === DRAG & DROP LINK

    const [collectedProps, drag] = useDrag({
        item: { id: lfoName, type: 'lfo' },
    });

    return (
        <Paper elevation={3} className={uiClasses.paper}>
            <Grid container>
                <Grid container className={uiClasses.moduleHeaderContainer}>
                    <Grid item xs={8} className={uiClasses.moduleHeader}>
                        <span className={uiClasses.moduleHeaderText}>
                            <Typography variant="button" className={uiClasses.moduleHeaderTypography}>
                                {' '}
                                &nbsp; LFO <strong>{lfoName.substring(3, 4)}</strong>
                            </Typography>
                        </span>
                    </Grid>
                    <Grid item xs={4} className={`${uiClasses.shiftRight} ${uiClasses.moduleHeaderActions}`}>
                        <div className={classes.lfoDropTarget} ref={drag}>
                            🔂
                        </div>
                        <div className={classes.dragLink} ref={drag}>
                            🔗
                        </div>
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item xs={6}>
                        <Knob
                            unlockDistance={0}
                            preciseMode={true}
                            defaultValue={frequency}
                            min={0.1}
                            step={0.1}
                            skin={skins.s9}
                            max={10}
                            className={uiClasses.knob}
                            value={frequency}
                            onChange={onFrequencyChange()}
                            rotateDegrees={180}
                            style={{
                                width: '35px',
                                height: '35px',
                            }}
                        />
                        <Typography variant="caption" className={uiClasses.smallCaption}>
                            FREQUENCY
                        </Typography>
                        <br />
                        {frequency.toFixed(2)} Hz
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="MIN"
                            variant="outlined"
                            style={{ marginTop: 5 }}
                            type="number"
                            value={min}
                            InputProps={{
                                inputProps: {
                                    min: -20000,
                                    max: 20000,
                                },
                            }}
                            onChange={onMinChange()}
                            className={`${uiClasses.smallNumberField} ${uiClasses.detuneField}`}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <TextField
                            label="MAX"
                            style={{ marginTop: 10 }}
                            variant="outlined"
                            type="number"
                            value={max}
                            InputProps={{
                                inputProps: {
                                    min: -20000,
                                    max: 20000,
                                },
                            }}
                            onChange={onMaxChange()}
                            className={`${uiClasses.smallNumberField} ${uiClasses.detuneField}`}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};
