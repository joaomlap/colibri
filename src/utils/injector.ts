import { INJECT_CONSTRUCTOR_DEPS, INJECT_FIELD_DEPS } from "decorators/Inject";
import { INewable } from "INewable";
import { InjectableNotFound } from "exceptions/InjectableNotFound";
import { IDependency } from "../IDependency";
import { InfiniteInjectingLoop } from "exceptions/InfiniteInjectingLoop";
import { InjectingException } from "exceptions/InjectingException";
// import { INJECTABLES } from "decorators/Injectable";

function createInjectablesMap(injectables: INewable[]): Map<string, INewable> {
  const map = new Map<string, INewable>();

  injectables.forEach(injectable => map.set(injectable.name, injectable));

  return map;
}

function getInjectable(
  constructor: INewable,
  name: string,
  map: Map<string, INewable>
) {
  if (!name) {
    throw new InjectingException();
  }

  const Injectable = map.get(name);

  if (!Injectable) {
    throw new InjectableNotFound(name);
  }

  preventInfiniteCycles(constructor, Injectable);

  return getInjectedConstructor(Injectable, map);
}

function getConstructorWithInjectedFields(
  constructor: INewable,
  map: Map<string, INewable>
): INewable {
  let result = constructor;
  const depsToInjectAsFields = Reflect.getMetadata(INJECT_FIELD_DEPS, result);

  if (Array.isArray(depsToInjectAsFields)) {
    depsToInjectAsFields.forEach((dep: IDependency) => {
      const depName = dep && dep.propertyType && dep.propertyType.name;
      const Injectable = getInjectable(constructor, depName, map);

      const InjectableCtor = getInjectedConstructor(Injectable, map);
      result.prototype[dep.propertyKey] = new InjectableCtor();
    });
  }

  return result;
}

function getConstructorWithInjectedProps(
  constructor: INewable,
  map: Map<string, INewable>
): INewable {
  let result = constructor;
  const depsToInjectInConstructor = Reflect.getMetadata(
    INJECT_CONSTRUCTOR_DEPS,
    constructor
  );

  const args: any[] = [];

  if (Array.isArray(depsToInjectInConstructor)) {
    depsToInjectInConstructor.forEach((dep: IDependency) => {
      const depName = dep && dep.propertyType && dep.propertyType.name;
      const Injectable = getInjectable(constructor, depName, map);

      const InjectableCtor = getInjectedConstructor(Injectable, map);

      if (typeof dep.propertyIndex === "number") {
        args[dep.propertyIndex] = new InjectableCtor();
      }
    });

    result = constructor.bind(null, ...args);
  }

  return result;
}

function getInjectedConstructor(
  constructor: INewable,
  map: Map<string, INewable>
): INewable {
  let result = constructor;

  result = getConstructorWithInjectedFields(result, map);
  result = getConstructorWithInjectedProps(result, map);

  return result;
}

function preventInfiniteCycles(constructor: INewable, injectable: INewable) {
  if (constructor.prototype === injectable.prototype) {
    throw new InfiniteInjectingLoop();
  }
}

export function injector(constructor: INewable, injectables: INewable[]) {
  return getInjectedConstructor(constructor, createInjectablesMap(injectables));
}
