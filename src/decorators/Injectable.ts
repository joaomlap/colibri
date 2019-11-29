import { DuplicateInjectableDecorator } from "../exceptions/DuplicateInjectableDecorator";
export const INJECTABLES = "__injectables__";

export function Injectable() {
  return function injectableDecorator(constructor: Function) {
    if (Reflect.hasOwnMetadata(INJECTABLES, constructor)) {
      throw new DuplicateInjectableDecorator();
    }

    const types = Reflect.getMetadata("design:paramtypes", constructor) || [];
    Reflect.defineMetadata(INJECTABLES, types, constructor);
  };
}
