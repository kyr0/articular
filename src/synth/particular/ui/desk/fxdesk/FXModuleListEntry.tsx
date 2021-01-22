import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FXModule } from '../../../synth/interface/FXModule';
import { Draggable } from 'react-beautiful-dnd';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import { getClasses } from './FXModuleListEntry.jss';
import { Checkbox, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { getClasses as getUiClasses } from '../../UI.jss';
import { EVENT_OPTIONS_CHANGED, OptionsBusContext } from '../../../bus/OptionsBusManager';
import { OptionsContext } from '../../../Particular';

export interface FXModuleListEntryProps {
    module: FXModule<any>;
    index: number;
}

export const FXModuleListEntry = ({ module: latestModule, index }: FXModuleListEntryProps) => {
    const classes = getClasses();
    const uiClasses = getUiClasses();

    const optionsContext = useContext(OptionsContext);
    const optionsBusContext = useContext(OptionsBusContext);
    const [module, setLatestModule] = useState(latestModule);

    const onEnableChange = useCallback(
        () => (evt: any) => {
            const modules = [...(optionsContext?.effectRack.modules || [])];

            modules[index].enabled = evt.target.checked;

            optionsBusContext.publish(EVENT_OPTIONS_CHANGED, {
                effectRack: {
                    modules,
                },
            });
        },
        [optionsContext?.effectRack.modules],
    );
    return (
        <Draggable draggableId={module.name} index={index}>
            {(provided) => (
                <Paper
                    className={classes.fxModule}
                    elevation={3}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <Grid container>
                        <Grid item xs={2} className={uiClasses.moduleHeader} style={{ margin: 'auto' }}>
                            <Checkbox
                                checked={module.enabled}
                                className={uiClasses.smallCheckbox}
                                onChange={onEnableChange()}
                            />
                            <Typography variant="caption" className={uiClasses.moduleHeaderText}>
                                <strong>{module.label} ⇳</strong>
                            </Typography>
                        </Grid>
                        <Grid item xs={10} className={classes.flexLeft}>
                            <br />
                            TODO: Controls
                            <br />
                            <br />
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </Draggable>
    );
};
