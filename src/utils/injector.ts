import { INJECT_CONSTRUCTOR_DEPS, INJECT_FIELD_DEPS } from "decorators/Inject";
import { INewable } from "INewable";
import { InjectableNotFound } from "exceptions/InjectableNotFound";
import { IDependency } from "../IDependency";
import { InfiniteInjectingLoop } from "exceptions/InfiniteInjectingLoop";
import { InjectingException } from "exceptions/InjectingException";
import { INJECTABLES } from "decorators/Injectable";
import { UnbuildableDependency } from "exceptions/UnbuildableDependency";
// import { INJECTABLES } from "decorators/Injectable";

function createInjectablesMap(injectables: INewable[]): Map<string, INewable> {
  const map = new Map<string, INewable>();

  injectables.forEach(injectable => map.set(injectable.name, injectable));

  return map;
}

function checkIfInjectableIsBuildable(Injectable: INewable) {
  // prevent unbuildable injectables
  const needs: INewable[] = Reflect.getMetadata(INJECTABLES, Injectable) || [];
  const has = new Map<INewable, boolean>();

  const injectableInjectFields = Reflect.getMetadata(
    INJECT_FIELD_DEPS,
    Injectable
  );

  const injectableInjectConstructorProps = Reflect.getMetadata(
    INJECT_CONSTRUCTOR_DEPS,
    Injectable
  );

  if (Array.isArray(injectableInjectFields)) {
    injectableInjectFields.forEach((dep: IDependency) => {
      has.set(dep.propertyType, true);
    });
  }

  if (Array.isArray(injectableInjectConstructorProps)) {
    injectableInjectConstructorProps.forEach((dep: IDependency) => {
      has.set(dep.propertyType, true);
    });
  }

  needs.forEach(need => {
    if (!has.get(need)) {
      throw new UnbuildableDependency();
    }
  });
}

function getInjectable(
  constructor: INewable,
  dep: IDependency,
  map: Map<string, INewable>
) {
  const name = dep && dep.propertyType && dep.propertyType.name;

  if (!name) {
    throw new InjectingException();
  }

  const Injectable = map.get(name);

  if (!Injectable) {
    throw new InjectableNotFound(name);
  }

  checkIfInjectableIsBuildable(Injectable);
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
      const InjectableCtor = getInjectable(constructor, dep, map);

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
    result
  );

  const args: any[] = [];

  if (Array.isArray(depsToInjectInConstructor)) {
    depsToInjectInConstructor.forEach((dep: IDependency) => {
      const InjectableCtor = getInjectable(constructor, dep, map);

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
