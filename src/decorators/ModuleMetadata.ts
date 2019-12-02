import { Type } from "utils/Type";
import { Module } from "Module";
import { IModuleMetadata } from "../IModuleMetadata";
export const MODULE = "__module__";

type ModuleType = Type<Module>;

export function ModuleMetadata(metadata: IModuleMetadata) {
  return function ModuleDecorator(target: ModuleType) {
    Reflect.defineMetadata(MODULE, metadata, target);
  };
}
