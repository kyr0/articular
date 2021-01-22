import { Checkbox, debounce, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { OptionsBusContext } from '../../../../bus/OptionsBusManager';
import { OptionsContext } from '../../../../Particular';
import { getClasses } from './Metal.jss';
import { getClasses as getUiClasses } from '../../../UI.jss';
import { useSyncConfig } from '../../../hook/useSyncConfig';
import TextField from '@material-ui/core/TextField';
import * as skins from 'react-rotary-knob-skin-pack';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Knob } from 'react-rotary-knob';
import Paper from '@material-ui/core/Paper';

export const Metal = () => {
    const uiClasses = getUiClasses();

    const optionsContext = useContext(OptionsContext);
    const optionsBusContext = useContext(OptionsBusContext);

    const onSetDebounced = useCallback(
        (param: string, debounceTime: number, childKey?: string) =>
            debounce((value: any) => {
                useSyncConfig(optionsBusContext, 'metal', param, value, childKey);
            }, debounceTime),
        [optionsBusContext],
    );

    const onSwitch = useCallback(
        (param: string, childKey?: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
            useSyncConfig(optionsBusContext, 'metal', param, event.target.checked, childKey);
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

    // === DETUNE

    const syncDetune = onSetDebounced('detune', 1);

    const onDetuneChange = useCallback(
        () => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            syncDetune(parseInt(event.target.value, 10) || 0);
        },
        [],
    );

    // === VOLUME / LEVEL

    const [volume, setVolume] = useState(optionsContext!.metal.volume! || 0.5);
    const syncVolume = onSetDebounced('volume', 25);

    const onVolumeChange = useCallback(
        () => (volume: number) => {
            setVolume(volume / 100);
            syncVolume(volume / 100);
        },
        [setVolume],
    );

    // === PAN

    const [pan, setPan] = useState<number>((optionsContext?.metal as any).pan || 0);
    const syncPan = onSetDebounced('pan', 1);

    const onPanChange = useCallback(
        () => (pan: number) => {
            setPan(pan / 100);
            syncPan(pan / 100);
        },
        [setPan],
    );

    // === HARMONICITY

    const [harmonicity, setHarmonicity] = useState<number>((optionsContext!.metal as any).harmonicity || 1);
    const syncHarmonicity = onSetDebounced('harmonicity', 1);

    const onHarmonicityChange = useCallback(
        () => (harmonicity: number) => {
            setHarmonicity(harmonicity / 100);
            syncHarmonicity(harmonicity / 100);
        },
        [setHarmonicity],
    );

    // === MODULATION INDEX

    const [modulationIndex, setModulationIndex] = useState<number>((optionsContext!.metal as any).modulationIndex || 0);
    const syncModulationIndex = onSetDebounced('modulationIndex', 1);

    const onModulationIndexChange = useCallback(
        () => (modulationIndex: number) => {
            setModulationIndex(modulationIndex / 100);
            syncModulationIndex(modulationIndex / 100);
        },
        [setModulationIndex],
    );

    // === OCTAVES

    const [octaves, setOctaves] = useState<number>((optionsContext!.metal as any).octaves || 0);
    const syncOctaves = onSetDebounced('octaves', 1);

    const onOctavesChange = useCallback(
        () => (octaves: number) => {
            setOctaves(octaves);
            syncOctaves(octaves);
        },
        [setOctaves],
    );

    return (
        <Paper elevation={3} className={uiClasses.paper}>
            <Grid container>
                <Grid container className={uiClasses.moduleHeaderContainer}>
                    <Grid item xs={6} className={uiClasses.moduleHeader}>
                        <Checkbox
                            checked={optionsContext?.metal?.enabled}
                            className={uiClasses.smallCheckbox}
                            onChange={onSwitchConnected()}
                        />
                        <Typography variant="button" className={uiClasses.moduleHeaderText}>
                            METAL
                        </Typography>
                    </Grid>
                    <Grid item xs={6} className={`${uiClasses.shiftRight} ${uiClasses.moduleHeaderActions}`}>
                        <TextField
                            label="CENTS"
                            variant="outlined"
                            type="number"
                            value={optionsContext?.metal?.detune}
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

                <Grid container style={{ marginTop: 3 }}>
                    <Grid item xs={4}>
                        <Knob
                            unlockDistance={0}
                            preciseMode={true}
                            defaultValue={harmonicity * 100}
                            min={0}
                            skin={skins.s12}
                            step={0.01}
                            max={1200}
                            className={uiClasses.knob}
                            value={harmonicity * 100}
                            onChange={onHarmonicityChange()}
                            rotateDegrees={180}
                            style={{
                                width: '35px',
                                height: '35px',
                            }}
                        />
                        <Typography variant="caption" className={uiClasses.smallCaption}>
                            HARMONICITY
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Knob
                            unlockDistance={0}
                            preciseMode={true}
                            defaultValue={modulationIndex * 100}
                            min={0}
                            skin={skins.s12}
                            step={0.01}
                            max={5000}
                            className={uiClasses.knob}
                            value={modulationIndex * 100}
                            onChange={onModulationIndexChange()}
                            rotateDegrees={180}
                            style={{
                                width: '35px',
                                height: '35px',
                            }}
                        />
                        <Typography variant="caption" className={uiClasses.smallCaption}>
                            MOD.
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Knob
                            unlockDistance={0}
                            preciseMode={true}
                            defaultValue={octaves}
                            min={1}
                            skin={skins.s12}
                            step={1}
                            max={6}
                            className={uiClasses.knob}
                            value={octaves}
                            onChange={onOctavesChange()}
                            rotateDegrees={180}
                            style={{
                                width: '35px',
                                height: '35px',
                            }}
                        />
                        <Typography variant="caption" className={uiClasses.smallCaption}>
                            OCTAVES
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container style={{ marginTop: 5 }}>
                    <Grid item xs={4}>
                        <div className={uiClasses.routing}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={optionsContext?.metal.enableRoutingFX}
                                        onChange={onSwitch('enableRoutingFX')}
                                        color="primary"
                                    />
                                }
                                label="FX"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={optionsContext?.metal.enableRoutingFilter}
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
