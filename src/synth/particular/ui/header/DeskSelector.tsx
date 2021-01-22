import { AppBar, Tabs, Tab } from '@material-ui/core';
import React, { useContext } from 'react';
import { getClasses } from './DeskSelector.jss';
import MultilineChartIcon from '@material-ui/icons/MultilineChart';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import SettingsIcon from '@material-ui/icons/Settings';
import { DeskChangeEvent, DESK_CHANGE, UIBusContext } from '../../bus/UIBusManager';
import { useState } from 'react';
import { useEffectOnce } from 'react-use';

export enum Desk {
    OSC,
    FX,
    MATRIX,
    GENERAL,
}

export const DeskSelector = () => {
    const classes = getClasses();
    const uiBusContext = useContext(UIBusContext);
    const [activeDesk, setActiveDesk] = useState(Desk.OSC);

    const onDeskChange = (evt: any, desk: Desk) => {
        console.log('onDeskChange', desk);
        uiBusContext.publish(DESK_CHANGE, {
            desk,
        });
    };

    useEffectOnce(() => {
        uiBusContext.subscribe(DESK_CHANGE, ({ desk }: DeskChangeEvent) => {
            setActiveDesk(desk);
        });
    });

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs value={activeDesk} onChange={onDeskChange}>
                    <Tab label="OSC" className={classes.tab} icon={<MultilineChartIcon />} />
                    <Tab label="FX" className={classes.tab} icon={<AcUnitIcon />} />
                    <Tab label="MOD" className={classes.tab} icon={<SettingsEthernetIcon />} />
                    <Tab label="GLOBAL" className={classes.tab} icon={<SettingsIcon />} />
                </Tabs>
            </AppBar>
        </div>
    );
};
