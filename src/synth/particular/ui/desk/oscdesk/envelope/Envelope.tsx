import { Paper } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { getClasses } from './Envelope.jss';
import { getClasses as getUiClasses } from '../../../UI.jss';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { EnvelopeScope } from './EnvelopeScope';
import { Module } from '../../../../synth/interface/Module';
import { TabPanel } from '../../../component/TabPanel';
import { useContext } from 'react';
import { OptionsContext } from '../../../../Particular';
import { useUpdate } from 'react-use';

export interface GraphPoint {
    x: number;
    y: number;
}

export const Envelope = () => {
    const classes = getClasses();
    const uiClasses = getUiClasses();
    const optionsContext = useContext(OptionsContext);
    const reRender = useUpdate();
    const [activeTab, setActiveTab] = useState<number>(0);

    useEffect(() => {
        reRender();
        console.log('ENV reRender');
    }, [optionsContext]);

    const onTabChange = useCallback(
        () => (evt: React.ChangeEvent<any>, tabIndex: any) => {
            setActiveTab(tabIndex);
        },
        [setActiveTab],
    );

    return (
        <div className={classes.root}>
            <Paper elevation={3} className={uiClasses.paper}>
                <AppBar position="static" className={classes.tabBar}>
                    <Tabs value={activeTab} onChange={onTabChange()}>
                        <Tab label="OSC A" className={classes.tab} />
                        <Tab label="OSC B" className={classes.tab} />
                        <Tab label="SUB" className={classes.tab} />
                        <Tab label="NOISE" className={classes.tab} />
                        {/**
                        <Tab label="M" className={classes.tab} />
                        <Tab label="P" className={classes.tab} />
                         */}
                    </Tabs>
                </AppBar>
                <TabPanel value={activeTab} index={0}>
                    <EnvelopeScope module={Module.OSC_A} />
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                    <EnvelopeScope module={Module.OSC_B} />
                </TabPanel>
                <TabPanel value={activeTab} index={2}>
                    <EnvelopeScope module={Module.SUB} />
                </TabPanel>
                <TabPanel value={activeTab} index={3}>
                    <EnvelopeScope module={Module.NOISE} />
                </TabPanel>

                {/*
                <TabPanel value={activeTab} index={4}>
                    <EnvelopeScope module={Module.METAL} />
                </TabPanel>
                <TabPanel value={activeTab} index={5}>
                    <EnvelopeScope module={Module.PLUCK} />
                </TabPanel>
                */}
            </Paper>
        </div>
    );
};
