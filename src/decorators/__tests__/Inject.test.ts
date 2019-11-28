import { Inject } from "../Inject";

describe("Inject decorator", () => {
  it("should create proper metadata to inject property", () => {
    class TestingClass {
      testing(@Inject() propToInject: Function) {}
    }
  });
});
