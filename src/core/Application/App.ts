import Express from "express";
import { Module } from "./Module";

export class App {
  constructor(
    private app: Express.Application,
    private port: number,
    private middlewares: Express.RequestHandler[] = [],
    private modules: Module[] = []
  ) {
    this.initialiseMiddlewares();
    this.initialiseModules();
  }

  initialiseMiddlewares() {
    if (this.middlewares && this.middlewares.length) {
      this.app.use(...this.middlewares);
    }
  }

  initialiseModules() {
    this.modules.forEach(module => {
      module.onInit(this.app);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on port ${this.port}...`);
    });
  }
}
