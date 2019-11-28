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

  const appConfig = {
    expressApp,
    middlewares,
    modules
  };

  return {
    expressApp,
    app: new App(appConfig)
  };
}

describe("App", () => {
  it("should create an application", async () => {
    const { expressApp, app } = getMocks();

    await app.listen(3000);

    expect(expressApp.use).not.toHaveBeenCalled();
    expect(expressApp.listen).toHaveBeenCalled();
  });

  it("should create an application with middleware", async () => {
    const fakeMiddleware = () => {};
    const { expressApp, app } = getMocks([fakeMiddleware]);

    await app.listen(3000);

    expect(expressApp.use).toHaveBeenCalledWith(fakeMiddleware);
    expect(expressApp.listen).toHaveBeenCalled();
  });

  it("should create an application with middleware and modules", async () => {
    const fakeMiddleware = () => {};
    const fakeModule = new Module();

    const { expressApp, app } = getMocks([fakeMiddleware], [fakeModule]);

    await app.listen(3000);

    expect(expressApp.use).toHaveBeenCalledWith(fakeMiddleware);
    expect(expressApp.listen).toHaveBeenCalled();
    expect(fakeModule.onInit).toHaveBeenCalled();
  });

  it("should allow to pass callback at app start", async () => {
    const { expressApp, app } = getMocks();
    const fakeCb = jest.fn();
    await app.listen(3000, fakeCb);

    expect(expressApp.listen).toHaveBeenCalledWith(3000, fakeCb);
  });
});
