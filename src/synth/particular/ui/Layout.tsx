import React, { useContext, useState } from 'react';
import { OSCDesk } from './desk/OSCDesk';
import { Header } from './Header';
import { getClasses } from './Layout.jss';
import { SubDesk } from './subdesk/SubDesk';
import Piano from 'react-piano-component';
import { VirtualMidiController } from './virtualmidicontroller/VirtualMidiController';
import { DeskChangeEvent, DESK_CHANGE, UIBusContext } from '../bus/UIBusManager';
import { useEffectOnce } from 'react-use';
import { Desk } from './header/DeskSelector';
import { FXDesk } from './desk/FXDesk';
import { MatrixDesk } from './desk/MatrixDesk';

export const Layout = () => {
    const classes = getClasses();

    const uiBusContext = useContext(UIBusContext);
    const [activeDesk, setActiveDesk] = useState(Desk.OSC);

    useEffectOnce(() => {
        uiBusContext.subscribe(DESK_CHANGE, ({ desk }: DeskChangeEvent) => {
            setActiveDesk(desk);
        });
    });

    const getNonFlushedStyle = (hiddenCondition: boolean): any => {
        if (hiddenCondition) {
            return {
                visibility: 'hidden',
                height: 0,
            };
        }
        return {
            visibility: 'visible',
            height: 'inherit',
        };
    };

    return (
        <main className={classes.root}>
            <Header />

            <div style={getNonFlushedStyle(activeDesk !== Desk.OSC)}>
                <OSCDesk />
            </div>

            <div style={getNonFlushedStyle(activeDesk !== Desk.FX)}>
                <FXDesk />
            </div>

            <div style={getNonFlushedStyle(activeDesk !== Desk.MATRIX)}>
                <MatrixDesk />
            </div>

            <SubDesk />
            <VirtualMidiController />
        </main>
    );
};
