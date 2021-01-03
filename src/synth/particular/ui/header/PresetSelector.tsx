import { ArticularContext, OptionsContext } from '../../Particular';
import { getClasses } from './PresetSelector.jss';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import React, { useContext, useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Preset } from '../../synth/interface/Preset';
import { EVENT_OPTIONS_CHANGED, OptionsBusContext } from '../../bus/OptionsBusManager';

const filter = createFilterOptions<Preset>();

export const PresetSelector = () => {
    const classes = getClasses();
    const articularContext = useContext(ArticularContext);
    const optionsContext = useContext(OptionsContext);
    const optionsBusContext = useContext(OptionsBusContext);
    const [presets, setPresets] = useState<Array<Preset>>([]);
    const [value, setValue] = useState<Preset | undefined>(articularContext?.getCurrentPreset());

    useEffect(() => {
        const presetList = [];
        const presetMap = articularContext?.getPresets() || {};
        for (const id in presetMap) {
            presetList.push(presetMap[id]);
        }
        setPresets(presetList);
    }, [articularContext]);

    return (
        <div className={classes.root}>
            <Autocomplete
                value={value}
                onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                        setValue({
                            id: Date.now() + '-preset',
                            name: newValue,
                            options: optionsContext!,
                        });
                    } else if (newValue && newValue.name) {
                        console.log('select preset', newValue);
                        setValue(newValue);
                        optionsBusContext.publish(EVENT_OPTIONS_CHANGED, newValue.options);
                    } else {
                        setValue(newValue!);
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    if (params.inputValue !== '') {
                        filtered.push({
                            id: Date.now() + '-preset',
                            name: params.inputValue,
                            options: optionsContext!,
                        });
                    }
                    return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                options={presets}
                getOptionLabel={(option) => {
                    if (typeof option === 'string') {
                        return option;
                    }
                    return option.name;
                }}
                renderOption={(option) => option.name}
                className={classes.presetField}
                freeSolo
                renderInput={(params) => <TextField {...params} label="Preset..." variant="outlined" />}
            />
        </div>
    );
};
