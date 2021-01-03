import React from 'react';
import { OSCDesk } from './desk/OSCDesk';
import { Header } from './Header';
import { getClasses } from './Layout.jss';
import { SubDesk } from './subdesk/SubDesk';
import Piano from 'react-piano-component';
import { VirtualMidiController } from './virtualmidicontroller/VirtualMidiController';

export const Layout = () => {
    const classes = getClasses();

    return (
        <main className={classes.root}>
            <Header />
            <OSCDesk />
            <SubDesk />
            <VirtualMidiController />
        </main>
    );
};
