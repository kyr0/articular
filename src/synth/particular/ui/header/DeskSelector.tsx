import { AppBar, Tabs, Tab } from '@material-ui/core';
import React, { createContext, useContext } from 'react';
import { getClasses } from './DeskSelector.jss';
import MultilineChartIcon from '@material-ui/icons/MultilineChart';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import SettingsIcon from '@material-ui/icons/Settings';

export enum Desks {
    OSC,
    FX,
    MATRIX,
    GENERAL,
}

export const DeskSelectorContext = createContext(Desks.OSC);

export const DeskSelector = () => {
    const classes = getClasses();
    const deskSelectorContext = useContext(DeskSelectorContext);

    const onDeskChange = (evt: any, desk: Desks) => {
        console.log('onDeskChange', desk);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs value={deskSelectorContext} onChange={onDeskChange}>
                    <Tab label="OSC" className={classes.tab} icon={<MultilineChartIcon />} />
                    <Tab label="FX" className={classes.tab} icon={<AcUnitIcon />} />
                    <Tab label="MATRIX" className={classes.tab} icon={<SettingsEthernetIcon />} />
                    <Tab label="GLOBAL" className={classes.tab} icon={<SettingsIcon />} />
                </Tabs>
            </AppBar>
        </div>
    );
};
