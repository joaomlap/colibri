import { Type } from "utils/Type";
import { Controller } from "Controller";
import { IControllerMetadata } from "../IControllerMetadata";
export const CONTROLLER = "__controller__";

type ControllerType = Type<Controller>;

export function ControllerMetadata(metadata: IControllerMetadata) {
  return function controllerDecorator(target: ControllerType) {
    Reflect.defineMetadata(CONTROLLER, metadata, target);
  };
}
