import "reflect-metadata";
import { Inject, INJECT_DEPENDENCIES } from "../../decorators/Inject";

describe("Inject decorator", () => {
  it("should create proper metadata to inject property", () => {
    class Test {
      testFn(@Inject() prop: string) {
        console.log(prop);
      }
    }

    new Test();

    expect(Reflect.getMetadata(INJECT_DEPENDENCIES, Test)).toEqual({
      propertyKey: "testFn",
      parameterIndex: 0,
      paramType: String
    });
  });
});
