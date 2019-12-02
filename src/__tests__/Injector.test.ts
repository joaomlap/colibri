import "reflect-metadata";
import { Injectable, INJECTABLES } from "decorators/Injectable";

describe("Injector", () => {
  it("should inject injectables where they are asked for", () => {
    @Injectable()
    class MyAmazingService {}

    expect(Reflect.getMetadata(INJECTABLES, MyAmazingService)).toBeDefined();
  });
});
