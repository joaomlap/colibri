import { INJECT_CONSTRUCTOR_DEPS, INJECT_FIELD_DEPS } from "decorators/Inject";
import { Newable } from "INewable";
// import { INJECTABLES } from "decorators/Injectable";

function createInjectablesMap(injectables: Newable[]): Map<string, Newable> {
  const map = new Map<string, Newable>();

  injectables.forEach(injectable => map.set(injectable.name, injectable));

  return map;
}

export function injector(constructor: Newable, injectables: Newable[]) {
  let result: Newable = constructor;
  const map = createInjectablesMap(injectables);

  const depsToInjectInConstructor = Reflect.getMetadata(
    INJECT_CONSTRUCTOR_DEPS,
    constructor
  );
  const depsToInjectAsFields = Reflect.getMetadata(
    INJECT_FIELD_DEPS,
    constructor
  );

  console.log({ depsToInjectAsFields, depsToInjectInConstructor });

  if (Array.isArray(depsToInjectAsFields)) {
    depsToInjectAsFields.forEach(_ => {});
  }

  if (Array.isArray(depsToInjectInConstructor)) {
    const args: any[] = [];

    depsToInjectInConstructor.forEach(dep => {
      const Injectable = map.get(dep.parameterType.name);

      if (!Injectable) {
        // todo
        throw new Error("no injectable found in module");
      }

      args[dep.parameterIndex] = new Injectable();
    });

    result = constructor.bind(null, ...args);
  }

  return result;
}
