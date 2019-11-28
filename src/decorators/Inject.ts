export const INJECT = "__INJECT__";

export function Inject() {
  return (
    target: Object,
    propertyKey: string | symbol
    // parameterIndex: number
  ) => {
    const token = Reflect.getMetadata("design:type", target, propertyKey);
    console.log(token);
  };
}
