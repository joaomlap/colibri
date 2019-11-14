import { Module } from "../Module";
import Express, { Router } from "express";
import { Controller } from "../Controller";

jest.mock("express", () => ({
  __esModule: true,
  default: () => ({
    use: jest.fn()
  }),
  Router: () => ({
    post: jest.fn()
  })
}));

describe("Module", () => {
  it("should create a module successfully", () => {
    const app = Express();

    class RandomModule extends Module {
      registerCommandHandlers = jest.fn();
    }

    const module = new RandomModule();

    module.onInit(app);

    expect(module.registerCommandHandlers).toHaveBeenCalled();
    expect(app.use).not.toHaveBeenCalled();
  });

  it("should create a module successfully with controllers", () => {
    const app = Express();
    const router = Router();

    class RandomModule extends Module {
      registerCommandHandlers = jest.fn();
    }
    class CoolController extends Controller {}

    const module = new RandomModule([new CoolController("/cool", router)]);

    module.onInit(app);

    expect(module.registerCommandHandlers).toHaveBeenCalled();
    expect(app.use).toHaveBeenCalledWith("/cool", router);
  });
});
