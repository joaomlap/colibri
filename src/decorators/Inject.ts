import { InjectPropOutsideConstructor } from "exceptions/InjectPropOutsideConstructor";

export const INJECT_CONSTRUCTOR_DEPS = "__INJECT_CONSTRUCTOR_DEPS__";
export const INJECT_FIELD_DEPS = "__INJECT_FIELD_DEPS__";

export function injectInClassProperty(
  target: Object,
  propertyKey: string | symbol
) {
  const propertyType = Reflect.getMetadata("design:type", target, propertyKey);

  const existingDependencies = Reflect.getMetadata(
    INJECT_FIELD_DEPS,
    target.constructor
  );

  Reflect.defineMetadata(
    INJECT_FIELD_DEPS,
    [
      ...(existingDependencies || []),
      {
        propertyKey,
        propertyType
      }
    ],
    target.constructor
  );
}

export function injectInClassConstructor(
  target: Object,
  propertyKey: string | symbol,
  propertyIndex: number
) {
  // when property key is undefined and target constructor
  // is Function, it means we have to inject the property
  // in the constructor
  if (propertyKey || target.constructor !== Function) {
    // todo
    throw new InjectPropOutsideConstructor();
  }

  const paramTypes =
    Reflect.getMetadata("design:paramtypes", target, propertyKey) || [];
  const propertyType = paramTypes[propertyIndex];

  const existingDependencies = Reflect.getMetadata(
    INJECT_CONSTRUCTOR_DEPS,
    target
  );

  Reflect.defineMetadata(
    INJECT_CONSTRUCTOR_DEPS,
    [
      ...(existingDependencies || []),
      {
        propertyIndex,
        propertyType
      }
    ],
    target
  );
}

export function Inject() {
  return (
    target: Object,
    propertyKey: string | symbol,
    propertyIndex?: number
  ) => {
    if (
      propertyIndex === undefined ||
      typeof propertyIndex !== "number" ||
      propertyIndex === -1
    ) {
      return injectInClassProperty(target, propertyKey);
    } else {
      return injectInClassConstructor(target, propertyKey, propertyIndex);
    }
  };
}
