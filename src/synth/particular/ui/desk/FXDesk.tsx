import Grid from '@material-ui/core/Grid';
import React, { memo, useContext, useState } from 'react';
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
import { OptionsContext } from '../../Particular';
import { EVENT_OPTIONS_CHANGED, OptionsBusContext } from '../../bus/OptionsBusManager';

export const FXDesk = memo(() => {
    const uiClasses = getUiClasses();
    const optionsContext = useContext(OptionsContext);
    const optionsBusContext = useContext(OptionsBusContext);

    const [state, setState] = useState<{
        modules: Array<FXModule<any>>;
    }>({
        modules: optionsContext?.effectRack.modules || [],
    });

    const onDragEnd = () => (result: any) => {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }
        const modules = reorder(state.modules, result.source.index, result.destination.index);

        modules.forEach((module, index) => {
            module.index = index;
        });

        setState({ modules });

        optionsBusContext.publish(EVENT_OPTIONS_CHANGED, {
            effectRack: {
                modules,
            },
        });
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <DragDropContext onDragEnd={onDragEnd()}>
                    <Droppable droppableId="list">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                <FXModuleList modules={state.modules}></FXModuleList>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </Grid>
        </Grid>
    );
});
