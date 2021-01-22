import { Checkbox, debounce, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { OptionsBusContext } from '../../../../bus/OptionsBusManager';
import { OptionsContext } from '../../../../Particular';
import { getClasses } from './Sub.jss';
import { getClasses as getUiClasses } from '../../../UI.jss';
import { useSyncConfig } from '../../../hook/useSyncConfig';
import TextField from '@material-ui/core/TextField';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { WaveForm } from '../../../../synth/interface/Waveform';
import * as skins from 'react-rotary-knob-skin-pack';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Knob } from 'react-rotary-knob';
import Paper from '@material-ui/core/Paper';

export const Sub = () => {
    const classes = getClasses();
    const uiClasses = getUiClasses();
    const parentRef = useRef(null);

    const optionsContext = useContext(OptionsContext);
    const optionsBusContext = useContext(OptionsBusContext);

    const onSetDebounced = useCallback(
        (param: string, debounceTime: number, childKey?: string) =>
            debounce((value: any) => {
                useSyncConfig(optionsBusContext, 'sub', param, value, childKey);
            }, debounceTime),
        [optionsBusContext],
    );

    const onSwitch = useCallback(
        (param: string, childKey?: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
            useSyncConfig(optionsBusContext, 'sub', param, event.target.checked, childKey);
        },
        [optionsBusContext],
    );

    const syncEnabled = onSetDebounced('enabled', 1);

    const onSwitchConnected = useCallback(
        () => (event: React.ChangeEvent<any>, value: any) => {
            syncEnabled(event.target.checked);
        },
        [],
    );

    // === OCTAVE

    const syncOctave = onSetDebounced('octave', 1);

    const onOctaveChange = useCallback(
        () => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            syncOctave(parseInt(event.target.value, 10) || 0);
        },
        [],
    );

    // === DETUNE

    const syncDetune = onSetDebounced('detune', 1);

    const onDetuneChange = useCallback(
        () => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            syncDetune(parseInt(event.target.value, 10) || 0);
        },
        [],
    );

    // === WAVE FORM

    const syncWaveForm = onSetDebounced('waveForm', 1);

    const onWaveFormChange = useCallback(
        () => (event: any, waveForm: string) => {
            syncWaveForm(waveForm);
        },
        [],
    );

    // === VOLUME / LEVEL

    const [volume, setVolume] = useState(optionsContext!.sub.volume! || 0.5);
    const syncVolume = onSetDebounced('volume', 25);

    const onVolumeChange = useCallback(
        () => (volume: number) => {
            setVolume(volume / 100);
            syncVolume(volume / 100);
        },
        [setVolume],
    );

    // === PAN

    const [pan, setPan] = useState<number>((optionsContext?.sub as any).pan || 0);
    const syncPan = onSetDebounced('pan', 1);

    const onPanChange = useCallback(
        () => (pan: number) => {
            setPan(pan / 100);
            syncPan(pan / 100);
        },
        [setPan],
    );

    return (
        <Paper elevation={3} className={uiClasses.paper}>
            <Grid container>
                <Grid container className={uiClasses.moduleHeaderContainer}>
                    <Grid item xs={4} className={uiClasses.moduleHeader}>
                        <Checkbox
                            checked={optionsContext?.sub?.enabled}
                            className={uiClasses.smallCheckbox}
                            onChange={onSwitchConnected()}
                        />
                        <Typography variant="button" className={uiClasses.moduleHeaderText}>
                            SUB
                        </Typography>
                    </Grid>
                    <Grid item xs={8} className={`${uiClasses.shiftRight} ${uiClasses.moduleHeaderActions}`}>
                        <TextField
                            label="OCT"
                            variant="outlined"
                            type="number"
                            InputProps={{
                                inputProps: {
                                    min: -4,
                                    max: 4,
                                },
                            }}
                            style={{
                                width: 35,
                            }}
                            value={optionsContext?.sub?.octave}
                            onChange={onOctaveChange()}
                            className={uiClasses.smallNumberField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <TextField
                            label="CENTS"
                            variant="outlined"
                            type="number"
                            value={optionsContext?.sub?.detune}
                            InputProps={{
                                inputProps: {
                                    min: -1200,
                                    max: 1200,
                                },
                            }}
                            onChange={onDetuneChange()}
                            className={`${uiClasses.smallNumberField} ${uiClasses.detuneField}`}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item xs={12}>
                        <ToggleButtonGroup
                            value={optionsContext?.sub!.waveForm}
                            className={uiClasses.waveformSelector}
                            exclusive
                            onChange={onWaveFormChange()}
                        >
                            <ToggleButton value={WaveForm.SAWTOOTH}>
                                <sup style={{ marginTop: -4 }}>႔႔</sup>
                            </ToggleButton>
                            <ToggleButton value={WaveForm.SINE}>ᔐ</ToggleButton>
                            <ToggleButton value={WaveForm.TRIANGLE}>ᄽ</ToggleButton>
                            <ToggleButton value={WaveForm.PULSE}>ႤႤ</ToggleButton>
                            <ToggleButton value={WaveForm.PWM}>Ⴄ_Ⴄ</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item xs={4}>
                        <div className={uiClasses.routing}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={optionsContext?.sub.enableRoutingFX}
                                        onChange={onSwitch('enableRoutingFX')}
                                        color="primary"
                                    />
                                }
                                label="FX"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={optionsContext?.sub.enableRoutingFilter}
                                        onChange={onSwitch('enableRoutingFilter')}
                                        color="primary"
                                    />
                                }
                                label="FIL"
                            />
                        </div>
                        <Typography variant="caption" className={uiClasses.smallCaption}>
                            ROUTING
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Knob
                            unlockDistance={0}
                            preciseMode={true}
                            defaultValue={pan * 100}
                            min={-100}
                            step={0.5}
                            skin={skins.s12}
                            max={100}
                            className={uiClasses.knob}
                            value={pan * 100}
                            onChange={onPanChange()}
                            rotateDegrees={180}
                            style={{
                                width: '35px',
                                height: '35px',
                            }}
                        />
                        <Typography variant="caption" className={uiClasses.smallCaption}>
                            PAN
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Knob
                            unlockDistance={0}
                            preciseMode={true}
                            defaultValue={volume * 100}
                            min={0}
                            step={0.1}
                            skin={skins.s12}
                            className={uiClasses.knob}
                            max={100}
                            value={volume * 100}
                            onChange={onVolumeChange()}
                            rotateDegrees={180}
                            style={{
                                width: '35px',
                                height: '35px',
                            }}
                        />
                        <Typography variant="caption" className={uiClasses.smallCaption}>
                            LEVEL
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};
