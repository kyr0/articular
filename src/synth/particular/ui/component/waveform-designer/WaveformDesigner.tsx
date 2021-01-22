import { Modal, Typography } from '@material-ui/core';
import React, { useCallback, useState, useContext } from 'react';
import { getClasses } from './WaveformDesigner.jss';
import { getClasses as getUiClasses } from '../../UI.jss';
import { SineWave } from '../../component/SineWave';
import Fade from '@material-ui/core/Fade';
import { SineSurface, SinusSurfaceWaveSpacing } from '../../component/SineSurface';
import { List } from 'immutable';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { TabPanel } from '../TabPanel';
import { debounce } from '../../../synth/function/debounce';
import { OptionsBusContext } from '../../../bus/OptionsBusManager';
import { OptionsContext } from '../../../Particular';
import { OscName } from '../../../synth/interface/OscName';
import { PolySynthOptions } from '../../../synth/interface/PolySynthOptions';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { Add, Close, Remove, VolumeDown, VolumeUp } from '@material-ui/icons';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import { useLatest } from 'react-use';
import { useSyncConfig } from '../../hook/useSyncConfig';
import { generatePeriodicWaveCoefficients } from '../../../synth/function/generatePeriodicWaveCoefficients';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { WaveForm } from '../../../synth/interface/Waveform';

export interface WaveformDesignerProps {
    onClose: () => void;
    open: boolean;
    partialSines: List<List<number>>;
    customWave: List<number>;
    oscName: OscName;
}

export const WaveformDesigner = ({ open, onClose, partialSines, customWave, oscName }: WaveformDesignerProps) => {
    const classes = getClasses();
    const uiClasses = getUiClasses();
    const optionsContext = useContext(OptionsContext);
    const optionsBusContext = useContext(OptionsBusContext);

    console.log('WaveformDesigner NEW partialSines', optionsContext);

    const onSetDebounced = useCallback(
        (param: string, debounceTime: number, childKey?: string) =>
            debounce((value: any) => {
                console.log('syncSetPartialAmplitudes', oscName, param, value, childKey);
                useSyncConfig(optionsBusContext, oscName, param, value, childKey);
            }, debounceTime),
        [optionsBusContext],
    );

    const [partialAmplitudes, setPartialAmplitudes] = useState(
        ((optionsContext![oscName] as PolySynthOptions).oscillator! as any).partials || [1],
    );
    const syncSetPartialAmplitudes = onSetDebounced('partials', 0, 'oscillator');

    const onRemoveHarmonic = useCallback(
        (index: number) => () => {
            console.log('onRemoveHarmonic', index);
            const newPartialAmplitudes = [...partialAmplitudes];
            newPartialAmplitudes.splice(index, 1);
            setPartialAmplitudes(newPartialAmplitudes);
            syncSetPartialAmplitudes(newPartialAmplitudes);
        },
        [partialAmplitudes],
    );

    const onAddHarmonic = useCallback(
        () => () => {
            const newPartialAmplitudes = [...partialAmplitudes, 0];
            setPartialAmplitudes(newPartialAmplitudes);
            syncSetPartialAmplitudes(newPartialAmplitudes);
        },
        [partialAmplitudes],
    );

    /*

    const [waveTablePosition, setWaveTablePosition] = useState(optionsContext![oscName].waveTablePosition! || 0);

    const onWaveTablePositionChange = useCallback(
        () => (evt: any, waveTablePosition: number | Array<number>) => {
            setWaveTablePosition(waveTablePosition as number);
            syncSetWaveTablePosition(waveTablePosition as number);
        },
        [setWaveTablePosition, syncSetWaveTablePosition],
    );
    */

    const onOvertoneAmplitudeChange = useCallback(
        (partialIndex: number) => (evt: any, newAplitude: any) => {
            console.log('onOvertoneAmplitudeChange', partialIndex, 'newAplitude', newAplitude, partialAmplitudes);

            const newPartialAmplitudes = [...partialAmplitudes];
            newPartialAmplitudes[partialIndex] = newAplitude;

            setPartialAmplitudes(newPartialAmplitudes);
            syncSetPartialAmplitudes(newPartialAmplitudes);
        },
        [partialAmplitudes],
    );

    const onStandardShapeClick = useCallback(
        (waveForm: WaveForm) => () => {
            const partials = generatePeriodicWaveCoefficients(waveForm);
            console.log('partials', partials);
            setPartialAmplitudes(partials);
            syncSetPartialAmplitudes(partials);
        },
        [],
    );

    return (
        <Modal className={classes.waveFormDesignerModal} open={open} closeAfterTransition onClose={onClose}>
            <Fade in={open}>
                <>
                    <Typography variant="h6">Harmonic Waveform Designer</Typography>
                    <br />
                    <ButtonGroup>
                        <Button onClick={onStandardShapeClick(WaveForm.SINE)}>ᔐ</Button>
                        <Button onClick={onStandardShapeClick(WaveForm.SAWTOOTH)}>
                            <sup style={{ marginTop: -4 }}>႔႔</sup>
                        </Button>
                        <Button onClick={onStandardShapeClick(WaveForm.TRIANGLE)}>ᄽ</Button>
                        <Button onClick={onStandardShapeClick(WaveForm.SQUARE)}>ႤႤ</Button>
                    </ButtonGroup>
                    <br />
                    <div
                        style={{
                            zIndex: -1,
                            marginTop: 150,
                            position: 'fixed',
                        }}
                    >
                        <SineSurface width={600} height={210} sines={partialSines} />
                    </div>
                    <div
                        style={{
                            zIndex: -1,
                            marginTop: -120,
                            position: 'fixed',
                        }}
                    >
                        <SineWave sineWaveControlPoints={customWave!} width={400} height={100} color="#ffffff" />
                    </div>
                    <div style={{ marginTop: 20, width: '80%' }}>
                        {partialAmplitudes.map((amplitude: number, index: number) => (
                            <Grid container key={index + Math.random()}>
                                <Typography style={{ color: '#999' }}>
                                    {' '}
                                    {index === 0 ? (
                                        <>
                                            <strong>Fundamental</strong>
                                        </>
                                    ) : (
                                        <>
                                            <strong>Harmonic {index}</strong>
                                        </>
                                    )}
                                    {': '} {(partialAmplitudes[index] * 100).toFixed(2)} %
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={1}>
                                        <VolumeDown color="secondary" />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Slider
                                            step={0.0001}
                                            min={-1.5}
                                            marks={[{ value: 0, label: '0' }]}
                                            max={1.5}
                                            value={amplitude}
                                            onChange={onOvertoneAmplitudeChange(index)}
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <VolumeUp color="secondary" />
                                    </Grid>
                                    {index > 0 && (
                                        <Grid item>
                                            <Button onClick={onRemoveHarmonic(index)} className={classes.removeButton}>
                                                <Remove color="secondary" />
                                            </Button>
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                        ))}

                        <Grid container>
                            <Grid item xs={12}>
                                <Button onClick={onAddHarmonic()} className={classes.addButton}>
                                    <Add color="secondary" /> Add another harmonic overtone
                                </Button>
                                <br />
                                <br />
                            </Grid>
                        </Grid>
                    </div>
                </>
            </Fade>
        </Modal>
    );
};
