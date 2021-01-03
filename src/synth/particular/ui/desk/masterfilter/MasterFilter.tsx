import { Checkbox, Grid, Paper, Slider, TextField, Typography } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Knob } from 'react-rotary-knob';
import { OptionsBusContext, EVENT_OPTIONS_CHANGED } from '../../../bus/OptionsBusManager';
import { EVENT_SIGNAL_CONNECT, SignalsBusContext } from '../../../bus/SignalsBusManager';
import { ArticularContext, OptionsContext } from '../../../Particular';
import * as skins from 'react-rotary-knob-skin-pack';
import { getClasses } from './MasterFilter.jss';
import { getClasses as getUiClasses } from '../../UI.jss';
import { ArticularOptions } from '../../../synth/interface/ArticularOptions';
import { debounce } from '../../../synth/function/debounce';
import { RecursivePartial } from '../../../synth/interface/RecursivePartial';
import { mergeOptions } from '../../../synth/function/mergeOptions';
import { WaveForm } from '../../../synth/interface/Waveform';
import { PWMOscillatorOptions } from 'tone';
import { useSyncConfig } from '../../hook/useSyncConfig';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Rolloff } from '../../../synth/interface/Rolloff';
import { enumToArray } from '../../function/enumToArray';
import { FilterType } from '../../../synth/interface/FilterType';
import { useDrop } from 'react-dnd';
import { GlobalSignals } from '../../../synth/Articular';
import { Module } from '../../../synth/interface/Module';
import { MasterFilerSignals } from '../../../synth/module/MasterFilter';

export const MasterFilter = () => {
    const classes = getClasses();
    const uiClasses = getUiClasses();
    const parentRef = useRef(null);

    const articular = useContext(ArticularContext);
    const optionsContext = useContext(OptionsContext);
    const optionsBusContext = useContext(OptionsBusContext);
    const signalsBusContext = useContext(SignalsBusContext);

    const onSwitchConnected = useCallback(
        () => (event: React.ChangeEvent<HTMLInputElement>) => {
            // broadcast
            optionsBusContext.publish(EVENT_OPTIONS_CHANGED, {
                masterFilter: {
                    enabled: event.target.checked,
                },
            });
        },
        [optionsContext],
    );

    const onSetDebounced = useCallback(
        (param: string, debounceTime: number, childKey?: string) =>
            debounce((value: any) => {
                useSyncConfig(optionsBusContext, 'masterFilter', param, value, childKey);
            }, debounceTime),
        [optionsBusContext],
    );

    const [cutoff, setCutoff] = useState<number>((optionsContext?.masterFilter as any).cutoff || 0);
    const syncCutoff = onSetDebounced('cutoff', 1);

    const onCutoffChange = useCallback(
        () => (cutoff: number) => {
            setCutoff(cutoff);
            syncCutoff(cutoff);
        },
        [setCutoff],
    );

    const [drive, setDrive] = useState<number>((optionsContext?.masterFilter as any).drive || 0);
    const syncDrive = onSetDebounced('drive', 1);

    const onDriveChange = useCallback(
        () => (drive: number) => {
            setDrive(drive / 100);
            syncDrive(drive / 100);
        },
        [setDrive],
    );

    const [resonance, setResonance] = useState<number>((optionsContext?.masterFilter as any).resonance || 0);
    const syncResonance = onSetDebounced('resonance', 1);

    const onResonanceChange = useCallback(
        () => (resonance: number) => {
            setResonance(resonance);
            syncResonance(resonance);
        },
        [setResonance],
    );

    // === TYPE

    const syncType = onSetDebounced('type', 1);
    const [type, setType] = useState(optionsContext?.masterFilter?.type);

    const onTypeChange = useCallback(
        () => (event: React.ChangeEvent<any>, value: any) => {
            syncType(event.target.value);
            setType(event.target.value);
        },
        [],
    );

    // === TYPE

    const syncRolloff = onSetDebounced('rolloff', 1);
    const [rolloff, setRolloff] = useState<number>(optionsContext?.masterFilter?.rolloff as number);

    const onRolloffChange = useCallback(
        () => (event: React.ChangeEvent<any>, value: any) => {
            syncRolloff(event.target.value);
            setRolloff(event.target.value);
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
    const [chartData, setChartData] = useState([{ x: 0, y: 0 }]);

    useEffect(() => {
        switch (type) {
            case FilterType.LOWPASS:
                setChartData([
                    { x: ((Math.abs(rolloff) - 100) / 100) * cutoff, y: 0 }, // 0 Hz
                    { x: cutoff, y: 50 },
                    { x: 20000, y: 50 }, // niquist freq.
                ]);
                break;
            case FilterType.HIGHPASS:
                setChartData([
                    { x: 0, y: 50 }, // 0 Hz
                    { x: cutoff, y: 50 },
                    // TODO: rolloff
                    { x: 20000 - ((Math.abs(rolloff) - 100) / 100) * cutoff, y: 0 }, // niquist freq.
                ]);
                break;
            default:
                setChartData([
                    // TODO
                    { x: 0, y: 50 }, // 0 Hz
                    { x: 0, y: 50 },
                ]);
        }
    }, [cutoff, type, parentRef, rolloff]);

    const dragTargetCutoff = useRef<HTMLDivElement | null>(null);
    const [, drop] = useDrop({
        accept: 'lfo',
        hover: () => {
            console.log('style over', dragTargetCutoff.current);

            if (dragTargetCutoff.current) {
                dragTargetCutoff.current.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }
        },
        collect: (monitor) => {
            if (!monitor.didDrop()) {
                console.log('unstyle out of region', dragTargetCutoff.current);

                if (dragTargetCutoff.current) {
                    dragTargetCutoff.current.style.backgroundColor = 'inherit';
                }
            }
        },
        drop: (item: any) => {
            console.log('dropped an LFO to connect with cutoff', item);

            console.log('unstyle drop on');

            if (dragTargetCutoff.current) {
                dragTargetCutoff.current.style.backgroundColor = 'inherit';
            }

            if (articular) {
                signalsBusContext.publish(EVENT_SIGNAL_CONNECT, {
                    source: {
                        type: 'lfo',
                        id: item.id,
                    },
                    target: {
                        module: Module.MASTER_FILTER,
                        signalId: 'frequency',
                    },
                });
            }
        },
    });

    return (
        <div className={classes.root}>
            <Paper elevation={3} className={uiClasses.paper}>
                <Grid container className={uiClasses.moduleHeaderContainer}>
                    <Grid item xs={4} className={uiClasses.moduleHeader}>
                        <Checkbox
                            checked={optionsContext?.masterFilter?.enabled}
                            className={uiClasses.smallCheckbox}
                            onChange={onSwitchConnected()}
                        />
                        <span className={uiClasses.moduleHeaderText}>
                            <Typography variant="button">
                                <strong>FIL</strong>TER
                            </Typography>
                        </span>
                    </Grid>
                    <Grid item xs={8} className={`${uiClasses.shiftRight} ${uiClasses.moduleHeaderActions}`}>
                        <Select
                            variant="outlined"
                            value={optionsContext?.masterFilter.type}
                            className={uiClasses.smallSelect}
                            onChange={onTypeChange()}
                        >
                            {Object.keys(FilterType).map((key: any) => (
                                <MenuItem key={key} value={(FilterType as any)[key]}>
                                    {(FilterType as any)[key]}
                                </MenuItem>
                            ))}
                        </Select>

                        <TextField
                            label="CENTS"
                            variant="outlined"
                            type="number"
                            value={optionsContext?.masterFilter?.detune}
                            InputProps={{
                                inputProps: {
                                    min: -1200,
                                    max: 1200,
                                },
                            }}
                            style={{ width: 50 }}
                            onChange={onDetuneChange()}
                            className={`${uiClasses.smallNumberField} ${uiClasses.detuneField}`}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid
                        item
                        xs={12}
                        ref={parentRef}
                        className={uiClasses.width100}
                        style={{ height: 100, paddingTop: 50 }}
                    >
                        <LineChart parentRef={parentRef} data={chartData} />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={3} ref={drop}>
                        <div ref={dragTargetCutoff}>
                            <Knob
                                unlockDistance={0}
                                preciseMode={true}
                                defaultValue={cutoff}
                                min={0}
                                skin={skins.s9}
                                step={1}
                                max={20000}
                                className={uiClasses.knob}
                                value={cutoff}
                                onChange={onCutoffChange()}
                                rotateDegrees={180}
                                style={{
                                    width: '35px',
                                    height: '35px',
                                }}
                            />
                            <Typography variant="caption" className={uiClasses.smallCaption}>
                                CUTOFF
                            </Typography>
                            <br />
                            {cutoff.toFixed()} Hz
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <Knob
                            unlockDistance={0}
                            preciseMode={true}
                            defaultValue={resonance}
                            min={0}
                            skin={skins.s9}
                            step={0.0001}
                            max={10}
                            className={uiClasses.knob}
                            value={resonance}
                            onChange={onResonanceChange()}
                            rotateDegrees={180}
                            style={{
                                width: '35px',
                                height: '35px',
                            }}
                        />
                        <Typography variant="caption" className={uiClasses.smallCaption}>
                            RES
                        </Typography>
                        <br />
                        {resonance.toFixed(2)}
                    </Grid>
                    <Grid item xs={3}>
                        <Knob
                            unlockDistance={0}
                            preciseMode={true}
                            defaultValue={drive * 100}
                            min={0}
                            skin={skins.s9}
                            step={0.1}
                            max={150}
                            className={uiClasses.knob}
                            value={drive * 100}
                            onChange={onDriveChange()}
                            rotateDegrees={180}
                            style={{
                                width: '35px',
                                height: '35px',
                            }}
                        />
                        <Typography variant="caption" className={uiClasses.smallCaption}>
                            DRIVE
                        </Typography>
                        <br />
                        {drive.toFixed(2)}
                    </Grid>
                    <Grid item xs={3}>
                        <Select
                            style={{
                                marginTop: 4,
                                marginBottom: 5,
                            }}
                            variant="outlined"
                            value={optionsContext?.masterFilter.rolloff}
                            className={uiClasses.smallSelect}
                            onChange={onRolloffChange()}
                        >
                            {enumToArray(Rolloff).map((key: any) => (
                                <MenuItem key={key} value={Rolloff[key]}>
                                    {Rolloff[key]}
                                </MenuItem>
                            ))}
                        </Select>
                        <br />
                        <Typography variant="caption" className={uiClasses.smallCaption}>
                            ROLLOFF (dB)
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
};

const getTicks = (count: number, max: number) => {
    return [...Array(count).keys()].map((d: any) => {
        return (max / (count - 1)) * parseInt(d);
    });
};

export const LineChart = ({ data, parentRef }: any) => {
    let WIDTH = 100;
    if (parentRef.current as HTMLElement) {
        console.log('parentRef.current.offsetWidth', parentRef.current.offsetWidth);
        WIDTH = parentRef.current.offsetWidth;
    }
    const classes = getClasses();
    console.log('parentRef', parentRef.current);
    const HEIGHT = 120;
    const MAX_X = Math.max(...data.map((d: any) => d.x));
    const MAX_Y = Math.max(...data.map((d: any) => d.y));

    const x = (val: number) => (val / MAX_X) * WIDTH;
    const y = (val: number) => HEIGHT - (val / MAX_Y) * HEIGHT;

    const d = `
        M${x(data[0].x)} ${y(data[0].y)} 
        ${data
            .slice(1)
            .map((d: any) => {
                return `L${x(d.x)} ${y(d.y)}`;
            })
            .join(' ')}
    `;

    return (
        <div
            className={classes.LineChart}
            style={{
                width: WIDTH + 'px',
                height: HEIGHT + 'px',
            }}
        >
            <svg className={classes.svg} width={WIDTH} height={HEIGHT}>
                <path d={d} />
            </svg>
        </div>
    );
};
