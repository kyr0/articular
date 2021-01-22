import React from 'react';
import { Layout } from './Layout';
import { ThemeManager } from './theme/ThemeManager';
import ScopedCssBaseline from '@material-ui/core/ScopedCssBaseline';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { UIBusManager } from '../bus/UIBusManager';

export const UI = () => {
    return (
        <ThemeManager>
            <ScopedCssBaseline>
                <UIBusManager>
                    <DndProvider backend={HTML5Backend}>
                        <Layout />
                    </DndProvider>
                </UIBusManager>
            </ScopedCssBaseline>
        </ThemeManager>
    );
};
