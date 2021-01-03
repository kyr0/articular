import { AbstractModuleOptions } from "../module/AbstractModule";
import { EffectOptions } from "./EffectOptions";

export interface EffectRackOptions extends AbstractModuleOptions {
    effects?: Array<EffectOptions<any>>;
}