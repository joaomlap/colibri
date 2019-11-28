import "reflect-metadata";
import Express from "express";
import { ControllerMetadata, CONTROLLER } from "../ControllerMetadata";
import { Controller } from "../../Controller";
import { IControllerMetadata } from "IControllerMetadata";

jest.mock("../../Controller");

jest.mock("express", () => ({
  Router: () => ({
    post: jest.fn()
  })
}));

describe("Controller Decorator", () => {
  it("should create metadata for specfic controller", () => {
    const specificMetadata: IControllerMetadata = { path: "abc" };
    const anotherMetadata: IControllerMetadata = {
      path: "def",
      router: Express.Router()
    };

    @ControllerMetadata(specificMetadata)
    class SpecificController extends Controller {}

    @ControllerMetadata(anotherMetadata)
    class AnotherController extends Controller {}

    expect(Reflect.getMetadata(CONTROLLER, SpecificController)).toBe(
      specificMetadata
    );
    expect(Reflect.getMetadata(CONTROLLER, AnotherController)).toBe(
      anotherMetadata
    );
  });
});
