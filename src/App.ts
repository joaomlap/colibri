import Express from "express";
import { Module } from "./Module";
import { CommandBus } from "CommandBus";
import { EventBus } from "EventBus";
import { AppContext } from "./AppContext";

export type AppConfig = {
  expressApp?: Express.Application;
  middlewares?: Express.RequestHandler[];
  modules?: Module[];
  commandBus?: CommandBus;
  eventBus?: EventBus;
};

export class App {
  private context: AppContext;
  private expressApp: Express.Application;
  private middlewares: Express.RequestHandler[] = [];
  private modules: Module[] = [];
  private commandBus: CommandBus = new CommandBus();
  private eventBus: EventBus = new EventBus();

  constructor({
    expressApp,
    middlewares,
    modules,
    commandBus,
    eventBus
  }: AppConfig) {
    this.expressApp = expressApp || Express();
    this.middlewares = middlewares || [];
    this.modules = modules || [];
    this.commandBus = commandBus || new CommandBus();
    this.eventBus = eventBus || new EventBus();

    this.initialiseMiddlewares();
    this.initialiseModules();

    this.context = new AppContext(
      this.expressApp,
      this.commandBus,
      this.eventBus
    );
  }

  initialiseMiddlewares() {
    if (this.middlewares && this.middlewares.length) {
      this.expressApp.use(...this.middlewares);
    }
  }

  initialiseModules() {
    this.modules.forEach(module => {
      module.onInit(this.context);
    });
  }

  public listen(port: number, callback?: () => void) {
    this.expressApp.listen(
      port,
      callback
        ? callback
        : () => console.log(`App listening on port ${port}...`)
    );
  }
}
