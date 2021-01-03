import { ArticularOptions } from './ArticularOptions';

export interface Preset {
    id: string;
    name: string;
    author?: string;
    description?: string;
    type?: string;
    subtype?: string;
    genre?: string;
    options: ArticularOptions;
}
