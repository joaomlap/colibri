import { ControllerBasePath, CONTROLLER } from "../ControllerBasePath";
import { Controller } from "../../Controller";

jest.mock("../../Controller");

describe("Controller Decorator", () => {
  it("should create metadata for specfic controller", () => {
    @ControllerBasePath("abc")
    class SpecificController extends Controller {}

    @ControllerBasePath("def")
    class AnotherController extends Controller {}

    expect(Reflect.getMetadata(CONTROLLER, SpecificController)).toBe("abc");
    expect(Reflect.getMetadata(CONTROLLER, AnotherController)).toBe("def");
  });
});
