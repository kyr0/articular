import { Checkbox, debounce, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { OptionsBusContext } from '../../../bus/OptionsBusManager';
import { OptionsContext } from '../../../Particular';
import { getClasses } from './Pluck.jss';
import { getClasses as getUiClasses } from '../../UI.jss';
import { useSyncConfig } from '../../hook/useSyncConfig';
import TextField from '@material-ui/core/TextField';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { WaveForm } from '../../../synth/interface/Waveform';
import * as skins from 'react-rotary-knob-skin-pack';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Knob } from 'react-rotary-knob';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { NoiseType } from '../../../synth/interface/NoiseType';
import Paper from '@material-ui/core/Paper';

export const Pluck = () => {
    const classes = getClasses();
    const uiClasses = getUiClasses();
    const parentRef = useRef(null);

    const optionsContext = useContext(OptionsContext);
    const optionsBusContext = useContext(OptionsBusContext);

    const onSetDebounced = useCallback(
        (param: string, debounceTime: number, childKey?: string) =>
            debounce((value: any) => {
                useSyncConfig(optionsBusContext, 'pluck', param, value, childKey);
            }, debounceTime),
        [optionsBusContext],
    );

    const onSwitch = useCallback(
        (param: string, childKey?: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
            useSyncConfig(optionsBusContext, 'pluck', param, event.target.checked, childKey);
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

    // === VOLUME / LEVEL

    const [volume, setVolume] = useState(optionsContext!.noise.volume! || 0.5);
    const syncVolume = onSetDebounced('volume', 25);

    const onVolumeChange = useCallback(
        () => (volume: number) => {
            setVolume(volume / 100);
            syncVolume(volume / 100);
        },
        [setVolume],
    );

    // === PAN

    const [pan, setPan] = useState<number>((optionsContext?.noise as any).pan || 0);
    const syncPan = onSetDebounced('pan', 1);

    const onPanChange = useCallback(
        () => (pan: number) => {
            setPan(pan / 100);
            syncPan(pan / 100);
        },
        [setPan],
    );

    // === ATTACK NOISE

    const [attackNoise, setAttackNoise] = useState<number>((optionsContext?.pluck as any).attackNoise || 0);
    const syncAttackNoise = onSetDebounced('attackNoise', 1);

    const onAttackNoiseChange = useCallback(
        () => (attackNoise: number) => {
            setAttackNoise(attackNoise);
            syncAttackNoise(attackNoise);
        },
        [setAttackNoise],
    );

    // === DAMPENING FREQUENCY

    const [dampening, setDampening] = useState<number>((optionsContext?.pluck as any).dampening || 0);
    const syncDampening = onSetDebounced('dampening', 1);

    const onDampeningChange = useCallback(
        () => (dampening: number) => {
            setDampening(dampening);
            syncDampening(dampening);
        },
        [setDampening],
    );

    // === RELEASE TIME

    const [release, setRelease] = useState<number>((optionsContext?.pluck as any).release || 0);
    const syncRelease = onSetDebounced('release', 1);

    const onReleaseChange = useCallback(
        () => (release: number) => {
            setRelease(release);
            syncRelease(release);
        },
        [setRelease],
    );
    return (
        <Paper elevation={3} className={uiClasses.paper}>
            <Grid container>
                <Grid container className={uiClasses.moduleHeaderContainer}>
                    <Grid item xs={12} className={uiClasses.moduleHeader}>
                        <Checkbox
                            checked={optionsContext?.pluck?.enabled}
                            className={uiClasses.smallCheckbox}
                            onChange={onSwitchConnected()}
                        />
                        <Typography variant="button" className={uiClasses.moduleHeaderText}>
                            PLUCK
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item xs={4}>
                        <Knob
                            unlockDistance={0}
                            preciseMode={true}
                            defaultValue={attackNoise}
                            min={0.1}
                            step={0.1}
                            skin={skins.s12}
                            max={20}
                            className={uiClasses.knob}
                            value={attackNoise}
                            onChange={onAttackNoiseChange()}
                            rotateDegrees={180}
                            style={{
                                width: '35px',
                                height: '35px',
                            }}
                        />
                        <Typography variant="caption" className={uiClasses.smallCaption}>
                            NOISE
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Knob
                            unlockDistance={0}
                            preciseMode={true}
                            defaultValue={dampening}
                            min={0}
                            step={1}
                            skin={skins.s12}
                            max={10000}
                            className={uiClasses.knob}
                            value={dampening}
                            onChange={onDampeningChange()}
                            rotateDegrees={180}
                            style={{
                                width: '35px',
                                height: '35px',
                            }}
                        />
                        <Typography variant="caption" className={uiClasses.smallCaption}>
                            DAMP (Hz)
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Knob
                            unlockDistance={0}
                            preciseMode={true}
                            defaultValue={release}
                            min={0}
                            step={0.1}
                            skin={skins.s12}
                            max={2}
                            className={uiClasses.knob}
                            value={release}
                            onChange={onReleaseChange()}
                            rotateDegrees={180}
                            style={{
                                width: '35px',
                                height: '35px',
                            }}
                        />
                        <Typography variant="caption" className={uiClasses.smallCaption}>
                            RELEASE (sec)
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item xs={4}>
                        <div className={uiClasses.routing}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={optionsContext?.pluck.enableRoutingFX}
                                        onChange={onSwitch('enableRoutingFX')}
                                        color="primary"
                                    />
                                }
                                label="FX"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={optionsContext?.pluck.enableRoutingFilter}
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
