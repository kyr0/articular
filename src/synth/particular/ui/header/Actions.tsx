import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { getClasses } from './Actions.jss';

export const Actions = () => {
    const classes = getClasses();

    return (
        <div className={classes.root}>
            <Button>↓</Button>
        </div>
    );
};
