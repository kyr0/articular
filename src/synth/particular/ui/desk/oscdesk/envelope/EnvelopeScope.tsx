import { Module } from '../../../../synth/interface/Module';
import { Grid, Typography } from '@material-ui/core';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Knob } from 'react-rotary-knob';
import { OptionsBusContext } from '../../../../bus/OptionsBusManager';
import { OptionsContext } from '../../../../Particular';
import * as skins from 'react-rotary-knob-skin-pack';
import { getClasses as getUiClasses } from '../../../UI.jss';
import { debounce } from '../../../../synth/function/debounce';
import { useSyncConfig } from '../../../hook/useSyncConfig';
import useResizeObserver from 'use-resize-observer';
import { EnvelopeGraph } from './EnvelopeGraph';
import { useUpdate } from 'react-use';

export interface EnvelopeScopeProps {
    module: Module;
}

export const EnvelopeScope = ({ module }: EnvelopeScopeProps) => {
    const uiClasses = getUiClasses();
    const optionsContext = useContext(OptionsContext);
    const optionsBusContext = useContext(OptionsBusContext);
    const reRender = useUpdate();
    const { ref: resizeRef, width = 1, height = 1 } = useResizeObserver<HTMLDivElement>();

    useEffect(() => {
        reRender();
        console.log('ENV reRender');
    }, [optionsContext]);

    const onSetDebounced = useCallback(
        (param: string, debounceTime: number, childKey?: string) =>
            debounce((value: any) => {
                useSyncConfig(optionsBusContext, module, param, value, childKey);
            }, debounceTime),
        [optionsBusContext],
    );

    // ATTACK

    const [attack, setAttack] = useState<number>(
        ((optionsContext as any)![module]['envelope']!.attack as number) || 0.1,
    );
    const syncAttack = onSetDebounced('attack', 1, 'envelope');

    const onAttackChange = useCallback(
        () => (attack: number) => {
            setAttack(attack / 100);
            syncAttack(attack / 100);
        },
        [setAttack],
    );

    // === DECAY

    const [decay, setDecay] = useState<number>(((optionsContext as any)![module].envelope!.decay as number) || 0.3);
    const syncDecay = onSetDebounced('decay', 1, 'envelope');

    const onDecayChange = useCallback(
        () => (decay: number) => {
            setDecay(decay / 100);
            syncDecay(decay / 100);
        },
        [setDecay],
    );

    // === SUSTAIN

    const [sustain, setSustain] = useState<number>(
        ((optionsContext as any)![module].envelope!.sustain as number) || 0.85,
    );
    const syncSustain = onSetDebounced('sustain', 1, 'envelope');

    const oSustainChange = useCallback(
        () => (sustain: number) => {
            setSustain(sustain / 100);
            syncSustain(sustain / 100);
        },
        [setSustain],
    );

    // === RELEASE

    const [release, setRelease] = useState<number>(
        ((optionsContext as any)![module].envelope!.release as number) || 0.4,
    );
    const syncRelease = onSetDebounced('release', 1, 'envelope');

    const onReleaseChange = useCallback(
        () => (release: number) => {
            setRelease(release / 100);
            syncRelease(release / 100);
        },
        [setRelease],
    );

    const [envelope, setEnvelope] = useState([{ x: 0, y: 0 }]);

    useEffect(() => {
        if (attack && decay && sustain && release) {
            setEnvelope([
                { x: 0, y: 0 },
                { x: attack, y: 100 }, // A
                {
                    x: attack + decay,
                    y: sustain * 100,
                }, // D
                {
                    x: attack + decay * 2,
                    y: sustain * 100,
                }, // S
                { x: attack + decay * 2, y: sustain * 100 },
                { x: attack + decay * 2 + release, y: 0 }, // R
            ]);
        }
    }, [attack, decay, release, sustain]);

    return (
        <>
            <div ref={resizeRef} style={{ width: '100%' }}>
                <EnvelopeGraph width={width} height={height} data={envelope} />
            </div>
            <Grid container style={{ paddingTop: 5, paddingBottom: 5 }}>
                <Grid item xs={3}>
                    <Knob
                        unlockDistance={0}
                        preciseMode={true}
                        defaultValue={attack * 100}
                        min={0}
                        skin={skins.s9}
                        step={0.05}
                        max={1500}
                        className={uiClasses.knob}
                        value={attack * 100}
                        onChange={onAttackChange()}
                        rotateDegrees={180}
                        style={{
                            width: '35px',
                            height: '35px',
                        }}
                    />
                    <Typography variant="caption" className={uiClasses.smallCaption}>
                        <strong>A</strong>TTACK
                    </Typography>
                    <br />
                    {attack <= 1 && (attack * 1000).toFixed(0) + ' ms'}
                    {attack > 1 && attack.toFixed(2) + ' s'}
                </Grid>
                <Grid item xs={3}>
                    <Knob
                        unlockDistance={0}
                        preciseMode={true}
                        defaultValue={decay * 100}
                        min={0}
                        skin={skins.s9}
                        step={0.05}
                        max={1500}
                        className={uiClasses.knob}
                        value={decay * 100}
                        onChange={onDecayChange()}
                        rotateDegrees={180}
                        style={{
                            width: '35px',
                            height: '35px',
                        }}
                    />
                    <Typography variant="caption" className={uiClasses.smallCaption}>
                        <strong>D</strong>ECAY
                    </Typography>
                    <br />
                    {decay <= 1 && (decay * 1000).toFixed(0) + ' ms'}
                    {decay > 1 && decay.toFixed(2) + ' s'}
                </Grid>
                <Grid item xs={3}>
                    <Knob
                        unlockDistance={0}
                        preciseMode={true}
                        defaultValue={sustain * 100}
                        min={0}
                        skin={skins.s9}
                        step={0.05}
                        max={100}
                        className={uiClasses.knob}
                        value={sustain * 100}
                        onChange={oSustainChange()}
                        rotateDegrees={180}
                        style={{
                            width: '35px',
                            height: '35px',
                        }}
                    />
                    <Typography variant="caption" className={uiClasses.smallCaption}>
                        <strong>S</strong>USTAIN
                    </Typography>
                    <br />
                    {(sustain * 100).toFixed(0) + ' %'}
                </Grid>
                <Grid item xs={3}>
                    <Knob
                        unlockDistance={0}
                        preciseMode={true}
                        defaultValue={release * 100}
                        min={0}
                        skin={skins.s9}
                        step={0.05}
                        max={1500}
                        className={uiClasses.knob}
                        value={release * 100}
                        onChange={onReleaseChange()}
                        rotateDegrees={180}
                        style={{
                            width: '35px',
                            height: '35px',
                        }}
                    />
                    <Typography variant="caption" className={uiClasses.smallCaption}>
                        <strong>R</strong>ELEASE
                    </Typography>
                    <br />
                    {release <= 1 && (release * 1000).toFixed(0) + ' ms'}
                    {release > 1 && release.toFixed(2) + ' s'}
                </Grid>
            </Grid>
        </>
    );
};
