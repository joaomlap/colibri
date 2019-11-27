import "reflect-metadata";
import { Type } from "core/utils/Type";
import { Controller } from "core/Controller";
export const CONTROLLER = "__controller__";

type ControllerType = Type<Controller>;

export function ControllerBasePath(path: string) {
  return function controllerDecorator(target: ControllerType) {
    Reflect.defineMetadata(CONTROLLER, path, target);
  };
}
