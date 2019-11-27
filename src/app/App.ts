import Express from "express";
import { Module } from "core/Module";

export default class App {
  public app: Express.Application;
  public port: number;

  constructor(
    port: number,
    middlewares: Express.RequestHandler[],
    modules?: Module[]
  ) {
    this.app = Express();
    this.port = port;

    this.initialiseMiddlewares(middlewares);
    this.initialiseModules(modules);
  }

  private initialiseMiddlewares(middlewares: Express.RequestHandler[] = []) {
    this.app.use(...middlewares);
  }

  private initialiseModules(modules: Module[] = []) {
    modules.forEach(module => module.registerCommandHandlers());
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on port ${this.port}...`);
    });
  }
}
