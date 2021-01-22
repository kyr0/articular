import Grid from '@material-ui/core/Grid';
import React, { memo, useContext, useEffect, useState } from 'react';
import { PolySynth } from './oscdesk/autofilterpolysynth/PolySynth';
import { getClasses as getUiClasses } from '../UI.jss';
import { MasterFilter } from './oscdesk/masterfilter/MasterFilter';
import { Sub } from './oscdesk/sub/Sub';
import { Noise } from './oscdesk/noise/Noise';
import { Envelope } from './oscdesk/envelope/Envelope';
import { Pluck } from './oscdesk/pluck/Pluck';
import { reorder } from '../function/reorder';
import { FXModule } from '../../synth/interface/FXModule';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { FXModuleList } from './fxdesk/FXModuleList';
import { SignalRoute } from '../../synth/interface/SignalRoute';
import { OptionsBusContext } from '../../bus/OptionsBusManager';
import { OptionsContext } from '../../Particular';

export const MatrixDesk = memo(() => {
    const uiClasses = getUiClasses();
    const optionsContext = useContext(OptionsContext);
    const optionsBusContext = useContext(OptionsBusContext);
    const [state, setState] = useState<{
        routes: Array<SignalRoute>;
    }>({
        routes: [],
    });

    useEffect(() => {
        setState({
            routes: optionsContext?.matrix.routes || [],
        });
    }, [optionsContext?.matrix]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                {state.routes.map((route: SignalRoute, index: number) => (
                    <div key={Math.random() * (index + 1)}>Route</div>
                ))}
            </Grid>
        </Grid>
    );
});
