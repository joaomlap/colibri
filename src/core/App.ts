import Express from "express";
import { Module } from "./Module";
import { CommandBus } from "core/CommandBus";
import { EventBus } from "core/EventBus";
import { AppContext } from "./AppContext";

export class App {
  private context: AppContext;

  constructor(
    private app: Express.Application,
    private middlewares: Express.RequestHandler[] = [],
    private modules: Module[] = [],
    private commandBus: CommandBus = new CommandBus(),
    private eventBus: EventBus = new EventBus()
  ) {
    this.initialiseMiddlewares();
    this.initialiseModules();

    this.context = new AppContext(this.app, this.commandBus, this.eventBus);
  }

  initialiseMiddlewares() {
    if (this.middlewares && this.middlewares.length) {
      this.app.use(...this.middlewares);
    }
  }

  initialiseModules() {
    this.modules.forEach(module => {
      module.onInit(this.context);
    });
  }

  public listen(port: number, callback?: () => void) {
    this.app.listen(
      port,
      callback
        ? callback
        : () => console.log(`App listening on port ${port}...`)
    );
  }
}
