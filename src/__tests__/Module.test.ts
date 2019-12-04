import "reflect-metadata";
import { Module } from "../Module";
import Express, { Router } from "express";
// import { Controller } from "../Controller";
import { AppContext } from "../AppContext";
import { CommandBus } from "../CommandBus";
import { EventBus } from "../EventBus";
import { ControllerMetadata } from "../decorators/ControllerMetadata";
import { ICommand } from "ICommand";
import { CommandHandler } from "decorators/commands";
import { ICommandHandler } from "ICommandHandler";
import { Ok } from "../Result";
import { Controller } from "Controller";
import { Injectable } from "decorators/Injectable";
import { ModuleMetadata } from "decorators/ModuleMetadata";
import { Inject } from "decorators/Inject";
import * as injectorModule from "../utils/injector";

jest.mock("express", () => ({
  __esModule: true,
  default: () => ({
    use: jest.fn()
  }),
  Router: () => ({
    post: jest.fn()
  })
}));

jest.mock("../CommandBus");

jest.spyOn(injectorModule, "injector");

describe("Module", () => {
  it("should create an empty module successfully", () => {
    const app = Express();
    const commandBus = new CommandBus();
    const eventBus = new EventBus();
    const appContext = new AppContext(app, commandBus, eventBus);

    const module = new Module();

    module.onInit(appContext);

    expect(app.use).not.toHaveBeenCalled();
  });

  it("should create a module successfully with controllers", () => {
    const app = Express();
    const commandBus = new CommandBus();
    const eventBus = new EventBus();
    const controllerMetadata = { path: "abc" };

    //Controller
    @ControllerMetadata(controllerMetadata)
    class RandomController extends Controller {}
    const appContext = new AppContext(app, commandBus, eventBus);

    // Module
    const module = new Module([RandomController]);

    module.onInit(appContext);

    expect((app.use as jest.Mock).mock.calls[0]).toContain(
      controllerMetadata.path
    );
  });

  it.only("should create a module successfully with controllers and command handlers", () => {
    const app = Express();
    const router = Router();
    const commandBus = new CommandBus();
    const eventBus = new EventBus();
    const controllerMetadata = { path: "abc", router };

    // controller
    @ControllerMetadata(controllerMetadata)
    class RandomController extends Controller {}

    // command & handler
    class RandomCommand implements ICommand {}

    @CommandHandler(RandomCommand)
    class RandomCommandHandler implements ICommandHandler {
      execute(_: RandomCommand) {
        return Promise.resolve(new Ok("oki-doki"));
      }
    }
    // const commandHandler = new RandomCommandHandler();

    // app context
    const appContext = new AppContext(app, commandBus, eventBus);

    const module = new Module([RandomController], [RandomCommandHandler]);

    module.onInit(appContext);

    expect(app.use).toHaveBeenCalledWith(
      controllerMetadata.path,
      controllerMetadata.router
    );

    expect(commandBus.registerHandler).toHaveBeenCalledTimes(1);
    expect((commandBus.registerHandler as jest.Mock).mock.calls[0]).toContain(
      RandomCommand
    );
    expect(
      (commandBus.registerHandler as jest.Mock).mock.calls[0][1]
    ).toBeInstanceOf(RandomCommandHandler);
  });

  it("should inject correctly dependencies", () => {
    // setup
    const app = Express();
    const commandBus = new CommandBus();
    const eventBus = new EventBus();

    // injectable service
    @Injectable()
    class GreatService {}

    // command & handler
    class RandomCommand implements ICommand {}

    @CommandHandler(RandomCommand)
    class GreatCommandHandler implements ICommandHandler {
      constructor(@Inject() public service: GreatService) {}

      execute(_: RandomCommand) {
        return Promise.resolve(new Ok("oki-doki"));
      }
    }

    // module
    @ModuleMetadata({ injectables: [GreatService] })
    class GreatModule extends Module {}

    // app context
    const appContext = new AppContext(app, commandBus, eventBus);

    // test
    const greatModule = new GreatModule([], [GreatCommandHandler], []);

    greatModule.onInit(appContext);

    expect(injectorModule.injector).toHaveBeenCalledWith(GreatCommandHandler, [
      GreatService
    ]);
  });
});
