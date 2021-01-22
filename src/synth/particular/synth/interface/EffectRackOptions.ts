import { AbstractModuleOptions } from './AbstractModuleOptions';
import { FXModule } from './FXModule';

export interface EffectRackOptions extends AbstractModuleOptions {
    modules?: Array<FXModule<any>>;
}
