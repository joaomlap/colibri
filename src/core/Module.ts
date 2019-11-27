import "reflect-metadata";
import Express from "express";
import { Type } from "./utils/Type";
import { Controller } from "core/Controller";
// import { ICommandHandler } from "core/domain/ICommandHandler";
import { IEventHandler } from "core/IEventHandler";
import { AppContext } from "./AppContext";
import { CommandBus } from "core/CommandBus";
import { EventBus } from "core/EventBus";
import { COMMAND_HANDLER } from "core/decorators/commands";
import { ICommandHandler } from "core/ICommandHandler";
import { CONTROLLER } from "./decorators/ControllerMetadata";
// import { IModule } from "./IModule";

type ControllerType = Type<Controller>;
type CommandHandlerType = Type<ICommandHandler>;
type EventHandlerType = Type<IEventHandler>;

export class Module {
  constructor(
    public controllers: ControllerType[] = [],
    private commandHandlers: CommandHandlerType[] = [],
    private eventHandlers: EventHandlerType[] = []
  ) {}

  onInit(context: AppContext) {
    this.initialiseControllers(context.app);
    this.registerCommandHandlers(context.commandBus);
    this.registerEventHandlers(context.eventBus);
  }

  private initialiseControllers(app: Express.Application) {
    if (this.controllers && this.controllers.length) {
      this.controllers.forEach(ControllerClass => {
        const path = Reflect.getMetadata(CONTROLLER, ControllerClass);
        const controller = new ControllerClass(path);

        app.use(controller.path, controller.router);
      });
    }
  }

  private registerCommandHandlers(commandBus: CommandBus) {
    if (this.commandHandlers && this.commandHandlers.length) {
      this.commandHandlers.forEach((Handler: CommandHandlerType) => {
        const CommandClass = Reflect.getMetadata(COMMAND_HANDLER, Handler);

        commandBus.registerHandler(CommandClass, new Handler());
      });
    }
  }

  private registerEventHandlers(eventBus: EventBus) {
    if (this.eventHandlers && this.eventHandlers.length) {
      // something
      console.log("event registering", eventBus);
    }
  }
}
