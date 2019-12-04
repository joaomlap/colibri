import Express from "express";
import { Type } from "./utils/Type";
import { Controller } from "Controller";
// import { ICommandHandler } from "core/domain/ICommandHandler";
import { IEventHandler } from "IEventHandler";
import { AppContext } from "./AppContext";
import { CommandBus } from "CommandBus";
import { EventBus } from "EventBus";
import { COMMAND_HANDLER } from "decorators/commands";
import { ICommandHandler } from "ICommandHandler";
import { CONTROLLER } from "./decorators/ControllerMetadata";
import { IControllerMetadata } from "./IControllerMetadata";
// import { INJECTABLES } from "decorators/Injectable";
import { MODULE } from "decorators/ModuleMetadata";
import { injector } from "utils/injector";
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
        const controllerMetadata: IControllerMetadata = Reflect.getMetadata(
          CONTROLLER,
          ControllerClass
        );
        const controller = new ControllerClass(
          controllerMetadata.path,
          controllerMetadata.router
        );

        app.use(controller.path, controller.router);
      });
    }
  }

  private registerCommandHandlers(commandBus: CommandBus) {
    if (this.commandHandlers && this.commandHandlers.length) {
      this.commandHandlers.forEach((Handler: CommandHandlerType) => {
        const CommandClass = Reflect.getMetadata(COMMAND_HANDLER, Handler);
        const moduleMetadata = Reflect.getMetadata(MODULE, this.constructor);
        const injectables =
          (moduleMetadata && moduleMetadata.injectables) || [];

        const HandlerCtor = injector(Handler, injectables);
        commandBus.registerHandler(CommandClass, new HandlerCtor());
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
