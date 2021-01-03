import React, { memo, useCallback, useContext, useState } from 'react';
import { getClasses } from './MasterControl.jss';
import { Knob } from 'react-rotary-knob';
import * as skins from 'react-rotary-knob-skin-pack';
import { Typography } from '@material-ui/core';
import { debounce } from '../../synth/function/debounce';
import { EVENT_OPTIONS_CHANGED, OptionsBusContext } from '../../bus/OptionsBusManager';
import { OptionsContext } from '../../Particular';
import { getClasses as getUIClasses } from '../UI.jss';

export const MasterControl = memo(() => {
    const optionsContext = useContext(OptionsContext);
    const optionsBusContext = useContext(OptionsBusContext);

    const [volumeDisplayValue, setVolumeDisplayValue] = useState((optionsContext?.masterGain || 0.75) * 100);

    const updateMasterVolume = useCallback(
        debounce<(volume: number) => void>((newMasterVolume: number) => {
            optionsBusContext.publish(EVENT_OPTIONS_CHANGED, {
                masterGain: newMasterVolume / 100,
            });
        }, 25 /* fader debounce 25 ms*/),
        [optionsBusContext],
    );

    const onMasterVolumeKnobChange = useCallback(
        () => (masterVolume: number) => {
            // update display knob value immediately
            setVolumeDisplayValue(masterVolume);

            // but update volume debounced all 25ms
            updateMasterVolume(masterVolume);
        },
        [setVolumeDisplayValue, updateMasterVolume],
    );

    const classes = getClasses();
    const uiClasses = getUIClasses();

    return (
        <div className={classes.root}>
            <Knob
                unlockDistance={0}
                preciseMode={true}
                defaultValue={volumeDisplayValue}
                min={0}
                skin={skins.s12}
                max={100}
                className={uiClasses.marginAuto}
                value={volumeDisplayValue}
                onChange={onMasterVolumeKnobChange()}
                rotateDegrees={180}
            />
            <Typography variant="caption">MASTER</Typography>
        </div>
    );
});
