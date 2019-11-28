export const INJECTABLE = "__injectable__";

export function Injectable() {
  return function injectableDecorator(constructor: Function) {
    Reflect.defineMetadata(INJECTABLE, {}, constructor);
  };
}
