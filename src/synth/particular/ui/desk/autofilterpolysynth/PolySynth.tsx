import { Checkbox, Grid, Paper, Slider, TextField, Typography } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import React, { useCallback, useContext, useState } from 'react';
import { Knob } from 'react-rotary-knob';
import { OptionsBusContext } from '../../../bus/OptionsBusManager';
import { OptionsContext } from '../../../Particular';
import * as skins from 'react-rotary-knob-skin-pack';
import { getClasses } from './PolySynth.jss';
import { getClasses as getUiClasses } from '../../UI.jss';
import { debounce } from '../../../synth/function/debounce';
import { WaveForm } from '../../../synth/interface/Waveform';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import Switch from '@material-ui/core/Switch/Switch';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import { AdvancedModulationType } from '../../../synth/interface/AdvancedModulationType';
import { useSyncConfig } from '../../hook/useSyncConfig';

export interface PolySynthProps {
    oscName: 'oscA' | 'oscB';
}

export const PolySynth = ({ oscName }: PolySynthProps) => {
    const classes = getClasses();
    const uiClasses = getUiClasses();

    const optionsContext = useContext(OptionsContext);
    const optionsBusContext = useContext(OptionsBusContext);

    const onSet = useCallback(
        (param: string, childKey?: string) => (value: any) => {
            useSyncConfig(optionsBusContext, oscName, param, value, childKey);
        },
        [optionsBusContext],
    );

    const onSetDebounced = useCallback(
        (param: string, debounceTime: number, childKey?: string) =>
            debounce((value: any) => {
                useSyncConfig(optionsBusContext, oscName, param, value, childKey);
            }, debounceTime),
        [optionsBusContext],
    );

    const onSwitch = useCallback(
        (param: string, childKey?: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
            useSyncConfig(optionsBusContext, oscName, param, event.target.checked, childKey);
        },
        [optionsBusContext],
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

    // === VOLUME / LEVEL

    const [volume, setVolume] = useState(optionsContext![oscName].volume! || 0.5);
    const syncVolume = onSetDebounced('volume', 25);

    const onVolumeChange = useCallback(
        () => (volume: number) => {
            setVolume(volume / 100);
            syncVolume(volume / 100);
        },
        [setVolume],
    );

    // === WAVETABLE POSITION

    const [waveTablePosition, setWaveTablePosition] = useState(optionsContext![oscName].waveTablePosition! || 0);
    const syncSetWaveTablePosition = onSetDebounced('waveTablePosition', 5);

    const onWaveTablePositionChange = useCallback(
        () => (evt: any, waveTablePosition: number | Array<number>) => {
            setWaveTablePosition(waveTablePosition as number);
            syncSetWaveTablePosition(waveTablePosition as number);
        },
        [setWaveTablePosition, syncSetWaveTablePosition],
    );

    // === PULSE WIDTH

    const [pulseWidth, setPulseWidth] = useState((optionsContext![oscName].oscillator as any).width! || 0);
    const syncWidth = onSetDebounced('width', 1, 'oscillator');

    const onPulseWidthChange = useCallback(
        () => (evt: any, width: number | Array<number>) => {
            setPulseWidth((width as number) - 0.49);
            syncWidth((width as number) - 0.49);
        },
        [setWaveTablePosition],
    );

    // === MODULATION FREQUENCY

    const [modulationFrequency, setModulationFrequency] = useState<number>(
        (optionsContext![oscName] as any).oscillator.modulationFrequency! || 0,
    );
    const syncModulationFrequency = onSetDebounced('modulationFrequency', 1, 'oscillator');

    const onModulationFrequencyChange = useCallback(
        () => (evt: any, modulationFrequency: number | Array<number>) => {
            setModulationFrequency(modulationFrequency as number);
            syncModulationFrequency(modulationFrequency as number);
        },
        [setModulationFrequency],
    );

    // === WAVE FORM

    const syncWaveForm = onSet('waveForm');
    const [waveForm, setWaveForm] = useState<any>(optionsContext![oscName]!.waveForm);

    const onWaveFormChange = useCallback(
        () => (event: any, newWaveForm: string) => {
            if (newWaveForm !== null) {
                setWaveForm(newWaveForm as any);
                syncWaveForm(newWaveForm);
            }
        },
        [setWaveForm, waveForm],
    );

    // === ADVANCED MODULATION TYPE

    const syncAdvancedModulationType = onSet('advancedModulationType');

    const onModulationTypeChange = useCallback(
        () => (event: React.ChangeEvent<HTMLInputElement>, advancedModulationType: string) => {
            syncAdvancedModulationType(advancedModulationType);
        },
        [],
    );

    // === PHASE

    const [phase, setPhase] = useState<number>((optionsContext![oscName] as any).oscillator.phase || 0);
    const syncPhase = onSetDebounced('phase', 1, 'oscillator');

    const onPhaseChange = useCallback(
        () => (phase: number) => {
            setPhase(phase);
            syncPhase(phase);
        },
        [setPhase],
    );

    // === FAT

    const syncUnison = onSetDebounced('unison', 1);

    const onUnisonChange = useCallback(
        () => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            syncUnison(parseInt(event.target.value, 10) || 0);
        },
        [],
    );

    const [spread, setSpread] = useState<number>((optionsContext![oscName] as any).spread || 0);
    const syncSpread = onSetDebounced('spread', 1);

    const onSpreadChange = useCallback(
        () => (spread: number) => {
            setSpread(spread);
            syncSpread(spread);
        },
        [setSpread],
    );

    // === AM/FM

    const [harmonicity, setHarmonicity] = useState<number>((optionsContext![oscName] as any).harmonicity || 1);
    const syncHarmonicity = onSetDebounced('harmonicity', 1);

    const onHarmonicityChange = useCallback(
        () => (harmonicity: number) => {
            setHarmonicity(harmonicity / 100);
            syncHarmonicity(harmonicity / 100);
        },
        [setHarmonicity],
    );

    const syncSubModulationType = onSet('subModulationType');
    const [subModulationType, setSubmodulationType] = useState<any>(optionsContext![oscName]!.subModulationType);

    const onSubModulationTypeChange = useCallback(
        () => (event: any, newWaveForm: string) => {
            if (newWaveForm !== null) {
                syncSubModulationType(newWaveForm);
                setSubmodulationType(newWaveForm);
            }
        },
        [subModulationType, setSubmodulationType],
    );

    const [modulationIndex, setModulationIndex] = useState<number>(
        (optionsContext![oscName] as any).modulationIndex || 0,
    );
    const syncModulationIndex = onSetDebounced('modulationIndex', 1);

    const onModulationIndexChange = useCallback(
        () => (modulationIndex: number) => {
            setModulationIndex(modulationIndex / 100);
            syncModulationIndex(modulationIndex / 100);
        },
        [setModulationIndex],
    );

    // === PAN

    const [pan, setPan] = useState<number>((optionsContext![oscName] as any).pan || 0);
    const syncPan = onSetDebounced('pan', 1);

    const onPanChange = useCallback(
        () => (pan: number) => {
            setPan(pan / 100);
            syncPan(pan / 100);
        },
        [setPan],
    );

    return (
        <div className={classes.root}>
            <Paper elevation={3} className={uiClasses.paper}>
                <Grid container>
                    <Grid item xs={12}>
                        <Grid container className={uiClasses.moduleHeaderContainer}>
                            <Grid item xs={6} className={uiClasses.moduleHeader}>
                                <Checkbox
                                    className={uiClasses.smallCheckbox}
                                    checked={optionsContext![oscName]?.enabled}
                                    onChange={onSwitch('enabled')}
                                />
                                <span className={uiClasses.moduleHeaderText}>
                                    <Typography variant="button" className={uiClasses.moduleHeaderTypography}>
                                        OSC <strong>{oscName === 'oscA' ? 'A' : 'B'}</strong>
                                    </Typography>
                                </span>
                            </Grid>
                            <Grid item xs={6} className={`${uiClasses.shiftRight} ${uiClasses.moduleHeaderActions}`}>
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
                                    value={optionsContext![oscName]?.octave}
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
                                    value={optionsContext![oscName]?.detune}
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
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <ToggleButtonGroup
                                    value={waveForm}
                                    className={uiClasses.waveformSelector}
                                    exclusive
                                    onChange={onWaveFormChange()}
                                    aria-label="Oscillator type"
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
                            {optionsContext![oscName].waveForm !== WaveForm.PULSE &&
                                optionsContext![oscName].waveForm !== WaveForm.PWM && (
                                    <Grid item xs={12}>
                                        <Typography variant="caption">
                                            W.T. POS.: {waveTablePosition ? waveTablePosition : '[START]'} / 32
                                        </Typography>
                                        <div className={classes.sliderContainer}>
                                            <Slider
                                                defaultValue={waveTablePosition}
                                                aria-labelledby="Waveform shape"
                                                valueLabelDisplay="off"
                                                className={uiClasses.smallSlider}
                                                value={waveTablePosition}
                                                onChange={onWaveTablePositionChange()}
                                                step={1}
                                                max={32}
                                            />
                                        </div>
                                    </Grid>
                                )}
                            {optionsContext![oscName].waveForm === WaveForm.PULSE && (
                                <Grid item xs={12}>
                                    <Typography variant="caption">PULSE WIDTH: {pulseWidth.toFixed(2)}</Typography>

                                    <div className={classes.sliderContainer}>
                                        <Slider
                                            defaultValue={pulseWidth + 0.49}
                                            valueLabelDisplay="off"
                                            value={pulseWidth + 0.49}
                                            className={uiClasses.smallSlider}
                                            onChange={onPulseWidthChange()}
                                            step={0.01}
                                            min={0}
                                            max={0.99}
                                        />
                                    </div>
                                </Grid>
                            )}

                            {optionsContext![oscName].waveForm === WaveForm.PWM && (
                                <Grid item xs={12}>
                                    <Typography variant="caption">MOD. FREQ.: {modulationFrequency} Hz</Typography>

                                    <div className={classes.sliderContainer}>
                                        <Slider
                                            defaultValue={modulationFrequency}
                                            valueLabelDisplay="off"
                                            scale={(x: number) => Math.pow(10, x)}
                                            value={modulationFrequency}
                                            className={uiClasses.smallSlider}
                                            onChange={onModulationFrequencyChange()}
                                            step={0.1}
                                            min={0}
                                            max={10000}
                                        />
                                    </div>
                                </Grid>
                            )}

                            <Grid container style={{ maxHeight: 248 }}>
                                <Grid item xs={3}>
                                    <RadioGroup
                                        className={classes.moduleationTypeRadios}
                                        value={optionsContext![oscName]?.advancedModulationType}
                                        onChange={onModulationTypeChange()}
                                    >
                                        <FormControlLabel
                                            style={{ marginTop: -91, paddingBottom: 12 }}
                                            className={classes.modulationTypeRadio}
                                            value={AdvancedModulationType.NONE}
                                            control={<Radio />}
                                            label="None"
                                        />
                                        <FormControlLabel
                                            className={classes.modulationTypeRadio}
                                            value={AdvancedModulationType.FAT}
                                            control={<Radio />}
                                            label="FAT"
                                        />
                                        <FormControlLabel
                                            className={classes.modulationTypeRadio}
                                            style={{
                                                borderBottom: '5px solid transparent',
                                            }}
                                            value={AdvancedModulationType.AM}
                                            control={<Radio />}
                                            label="AM"
                                        />
                                        <FormControlLabel
                                            className={classes.modulationTypeRadio}
                                            value={AdvancedModulationType.FM}
                                            control={<Radio />}
                                            label="FM"
                                        />
                                    </RadioGroup>
                                </Grid>
                                <Grid item xs={9}>
                                    <Grid container className={classes.modulationContainerTitle}>
                                        <Grid item xs={12} style={{ height: 35 }}></Grid>
                                    </Grid>
                                    <Grid container className={classes.modulationContainer}>
                                        <Grid item xs={4}>
                                            <TextField
                                                className={`${uiClasses.smallNumberField} ${classes.unisonField}`}
                                                label=""
                                                value={(optionsContext![oscName] as any).unison}
                                                type="number"
                                                InputProps={{
                                                    inputProps: {
                                                        min: 0,
                                                        max: 9,
                                                    },
                                                }}
                                                onChange={onUnisonChange()}
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                            <br />
                                            <Typography variant="caption" className={uiClasses.smallCaption}>
                                                UNISON
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Knob
                                                unlockDistance={0}
                                                preciseMode={true}
                                                defaultValue={spread}
                                                min={0}
                                                skin={skins.s12}
                                                step={10}
                                                max={100}
                                                className={uiClasses.knob}
                                                value={spread}
                                                onChange={onSpreadChange()}
                                                rotateDegrees={180}
                                                style={{
                                                    width: '35px',
                                                    height: '35px',
                                                }}
                                            />
                                            <Typography variant="caption" className={uiClasses.smallCaption}>
                                                SPREAD
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4} className={uiClasses.centerContents}>
                                            <Typography variant="body1" className={uiClasses.smallText}>
                                                ⚠️ Unison causes high CPU load
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid
                                        container
                                        className={classes.modulationContainer}
                                        style={{
                                            borderBottom: '5px solid transparent',
                                        }}
                                    >
                                        <Grid item xs={12} style={{ height: 53, display: 'flex' }}>
                                            <ToggleButtonGroup
                                                value={subModulationType}
                                                className={uiClasses.waveformSelector}
                                                style={{ margin: 'auto' }}
                                                exclusive
                                                onChange={onSubModulationTypeChange()}
                                            >
                                                <ToggleButton value={WaveForm.SQUARE}>⸙</ToggleButton>
                                                <ToggleButton value={WaveForm.SAWTOOTH}>
                                                    <sup style={{ marginTop: -4 }}>႔႔</sup>
                                                </ToggleButton>
                                                <ToggleButton value={WaveForm.SINE}>ᔐ</ToggleButton>
                                                <ToggleButton value={WaveForm.TRIANGLE}>ᄽ</ToggleButton>
                                            </ToggleButtonGroup>
                                        </Grid>
                                    </Grid>

                                    <Grid container className={classes.modulationContainer}>
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
                                                FM MOD.
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={3}>
                                <div className={uiClasses.routing}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={optionsContext![oscName].enableRoutingFX}
                                                onChange={onSwitch('enableRoutingFX')}
                                                color="primary"
                                            />
                                        }
                                        label="FX"
                                    />

                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={optionsContext![oscName].enableRoutingFilter}
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
                            <Grid item xs={3}>
                                <Knob
                                    unlockDistance={0}
                                    preciseMode={true}
                                    defaultValue={phase}
                                    min={0}
                                    skin={skins.s12}
                                    max={360}
                                    value={phase}
                                    className={uiClasses.knob}
                                    onChange={onPhaseChange()}
                                    rotateDegrees={180}
                                    style={{
                                        width: '35px',
                                        height: '35px',
                                    }}
                                />
                                <Typography variant="caption" className={uiClasses.smallCaption}>
                                    PHASE
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
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
                            <Grid item xs={3}>
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
                </Grid>
            </Paper>
        </div>
    );
};
