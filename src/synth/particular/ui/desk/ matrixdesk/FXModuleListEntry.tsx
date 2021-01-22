import React from 'react';
import { FXModule } from '../../../synth/interface/FXModule';
import { Draggable } from 'react-beautiful-dnd';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import { getClasses } from './FXModuleListEntry.jss';

export interface FXModuleListEntryProps {
    module: FXModule<any>;
    index: number;
}

export const FXModuleListEntry = ({ module, index }: FXModuleListEntryProps) => {
    const classes = getClasses();
    const onModuleEntryClick = () => () => {
        console.log('show module ');
    };

    return (
        <Draggable draggableId={module.name} index={index}>
            {(provided) => (
                <Paper
                    className={classes.fxModule}
                    elevation={3}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={onModuleEntryClick}
                >
                    {module.label}
                </Paper>
            )}
        </Draggable>
    );
};
