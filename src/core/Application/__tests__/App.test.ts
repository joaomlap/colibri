import Express from "express";
import { App } from "../App";
import { Module } from "../Module";

jest.mock("express", () => () => ({
  use: jest.fn(),
  listen: jest.fn()
}));

jest.mock("../Module");

function getMocks(
  middlewares: Express.RequestHandler[] = [],
  modules: Module[] = []
) {
  const expressApp = Express();

  return {
    expressApp,
    app: new App(expressApp, 3000, middlewares, modules)
  };
}

describe("App", () => {
  it("should create an application", async () => {
    const { expressApp, app } = getMocks();

    await app.listen();

    expect(expressApp.use).not.toHaveBeenCalled();
    expect(expressApp.listen).toHaveBeenCalled();
  });

  it("should create an application with middleware", async () => {
    const fakeMiddleware = () => {};
    const { expressApp, app } = getMocks([fakeMiddleware]);

    await app.listen();

    expect(expressApp.use).toHaveBeenCalledWith(fakeMiddleware);
    expect(expressApp.listen).toHaveBeenCalled();
  });

  it("should create an application with middleware and modules", async () => {
    const fakeMiddleware = () => {};
    class FakeModule extends Module {
      registerCommandHandlers() {}
    }
    const fakeModule = new FakeModule();

    const { expressApp, app } = getMocks([fakeMiddleware], [fakeModule]);

    await app.listen();

    expect(expressApp.use).toHaveBeenCalledWith(fakeMiddleware);
    expect(expressApp.listen).toHaveBeenCalled();
    expect(fakeModule.onInit).toHaveBeenCalled();
  });
});
