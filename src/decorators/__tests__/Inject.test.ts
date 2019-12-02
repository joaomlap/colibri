import "reflect-metadata";
import {
  Inject,
  INJECT_CONSTRUCTOR_DEPS,
  INJECT_FIELD_DEPS
} from "../../decorators/Inject";
import { InjectParamOutsideConstructor } from "exceptions/InjectParamOutsideConstructor";

describe("Inject decorator", () => {
  it("should create proper metadata to inject property in constructor", () => {
    class Test {
      constructor(@Inject() _: number) {}
    }

    new Test(1);

    expect(Reflect.getMetadata(INJECT_CONSTRUCTOR_DEPS, Test)).toEqual([
      {
        parameterIndex: 0,
        parameterType: Number
      }
    ]);
  });

  it("should create proper metadata to inject property in class properties", () => {
    class Test {
      @Inject() public prop: number;
    }

    new Test();

    expect(Reflect.getMetadata(INJECT_FIELD_DEPS, Test)).toEqual([
      {
        propertyKey: "prop",
        propertyType: Number
      }
    ]);
  });

  it("should throw an error when trying to inject parameter outside constructor", () => {
    expect(() => {
      class Test {
        testFn(@Inject() _: number) {}
      }

      new Test();
    }).toThrow(InjectParamOutsideConstructor);
  });
});
