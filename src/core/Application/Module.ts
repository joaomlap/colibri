import Express from "express";
import { Controller } from "core/application/Controller";
// import { IModule } from "./IModule";

export abstract class Module {
  constructor(public controllers?: Controller[]) {}

  onInit(app: Express.Application) {
    this.initialiseControllers(app);
    this.registerCommandHandlers();
  }

  private initialiseControllers(app: Express.Application) {
    if (this.controllers && this.controllers.length) {
      this.controllers.forEach(controller => {
        app.use(controller.path, controller.router);
      });
    }
  }

  abstract registerCommandHandlers(): void;
}
