import React, { memo } from 'react';
import { FXModule } from '../../../synth/interface/FXModule';
import { FXModuleListEntry } from './FXModuleListEntry';

export interface FXModuleListProps {
    modules: Array<FXModule<any>>;
}

export const FXModuleList = memo(({ modules }: FXModuleListProps) => {
    return (
        <div style={{ maxHeight: '50vh', overflow: 'auto' }}>
            {modules.map((module: FXModule<any>, index: number) => (
                <FXModuleListEntry module={module} index={index} key={module.name} />
            ))}
        </div>
    );
});
