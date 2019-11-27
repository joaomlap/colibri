import { Module } from "../Module";
import Express, { Router } from "express";
// import { Controller } from "../Controller";
import { AppContext } from "../AppContext";
import { CommandBus } from "../CommandBus";
import { EventBus } from "../EventBus";
import { ControllerBasePath } from "../decorators/ControllerBasePath";
import { ICommand } from "core/ICommand";
import { CommandHandler } from "core/decorators/commands";
import { ICommandHandler } from "core/ICommandHandler";
import { Ok } from "../Result";
import { Controller } from "core/Controller";

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
    const router = Router();
    const commandBus = new CommandBus();
    const eventBus = new EventBus();
    @ControllerBasePath("abc")
    class RandomController extends Controller {}
    const appContext = new AppContext(app, commandBus, eventBus);

    const module = new Module([RandomController]);

    module.onInit(appContext);

    expect(app.use).toHaveBeenCalledWith("/path", router);
  });

  it("should create a module successfully with controllers and command handlers", () => {
    const app = Express();
    const router = Router();
    const commandBus = new CommandBus();
    const eventBus = new EventBus();

    // controller
    @ControllerBasePath("/path")
    class RandomController extends Controller {}

    // command & handler
    class RandomCommand implements ICommand {}

    @CommandHandler(RandomCommand)
    class RandomCommandHandler implements ICommandHandler {
      execute(command: RandomCommand) {
        console.log(command);
        return Promise.resolve(new Ok("oki-doki"));
      }
    }
    // const commandHandler = new RandomCommandHandler();

    // app context
    const appContext = new AppContext(app, commandBus, eventBus);

    const module = new Module([RandomController], [RandomCommandHandler]);

    module.onInit(appContext);

    expect(app.use).toHaveBeenCalledWith("/path", router);
  });
});
