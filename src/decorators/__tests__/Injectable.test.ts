import "reflect-metadata";
import { Injectable, INJECTABLES } from "../Injectable";

describe("Injectable decorator", () => {
  it("should create an injectable from the class", () => {
    @Injectable()
    class InjectableClass {}

    @Injectable()
    class AnotherInjectableClass {
      constructor(public something: string) {}
    }

    expect(Reflect.getMetadata(INJECTABLES, InjectableClass)).toEqual([]);
    expect(Reflect.getMetadata(INJECTABLES, AnotherInjectableClass)).toContain(
      String
    );
  });
});
