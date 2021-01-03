import { Checkbox, Grid, Paper, Slider, TextField, Typography } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Knob } from 'react-rotary-knob';
import { OptionsBusContext, EVENT_OPTIONS_CHANGED } from '../../../bus/OptionsBusManager';
import { OptionsContext } from '../../../Particular';
import * as skins from 'react-rotary-knob-skin-pack';
import { getClasses } from './Envelope.jss';
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
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
};

export const Envelope = () => {
    const classes = getClasses();
    const uiClasses = getUiClasses();
    const parentRef = useRef(null);

    const optionsContext = useContext(OptionsContext);
    const optionsBusContext = useContext(OptionsBusContext);

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

    const [activeTab, setActiveTab] = useState<number>(0);

    const onTabChange = useCallback(
        () => (evt: React.ChangeEvent<any>, tabIndex: any) => {
            setActiveTab(tabIndex);
        },
        [setActiveTab],
    );

    return (
        <div className={classes.root}>
            <Paper elevation={3} className={uiClasses.paper}>
                <AppBar position="static" className={classes.tabBar}>
                    <Tabs value={activeTab} onChange={onTabChange()} aria-label="simple tabs example">
                        <Tab label="A" className={classes.tab} />
                        <Tab label="B" className={classes.tab} />
                        <Tab label="S" className={classes.tab} />
                        <Tab label="N" className={classes.tab} />
                        <Tab label="M" className={classes.tab} />
                        <Tab label="P" className={classes.tab} />
                    </Tabs>
                </AppBar>
                <TabPanel value={activeTab} index={0}>
                    OSC A ENVELOPE
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                    OSC B ENVELOPE
                </TabPanel>
                <TabPanel value={activeTab} index={2}>
                    SUB ENVELOPE
                </TabPanel>
                <TabPanel value={activeTab} index={3}>
                    NOISE ENVELOPE
                </TabPanel>
                <TabPanel value={activeTab} index={4}>
                    METAL ENVELOPE
                </TabPanel>
                <TabPanel value={activeTab} index={5}>
                    PLUCK ENVELOPE
                </TabPanel>
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
