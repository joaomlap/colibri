export const INJECT_DEPENDENCIES = "__INJECT_DEPENDENCIES__";

export function Inject<T = any>(token?: T) {
  return (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ) => {
    if (parameterIndex === undefined || parameterIndex === -1) {
      throw new Error("misuse of inject decorator");
    }

    const paramTypes = Reflect.getMetadata(
      "design:paramtypes",
      target,
      propertyKey
    );
    const paramType = token || paramTypes[parameterIndex];

    Reflect.defineMetadata(
      INJECT_DEPENDENCIES,
      {
        propertyKey,
        parameterIndex,
        paramType
      },
      target.constructor
    );
  };
}
