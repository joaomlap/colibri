import "reflect-metadata";
import Express from "express";
import { httpMethods, httpDecoratorMetaData } from "./decorators/http";
import { ControllerPathNotFound } from "./exceptions/ControllerPathNotFound";

export class Controller {
  constructor(
    public path: string,
    public router: Express.Router = Express.Router()
  ) {
    // break if user does not decorate controller
    if (!this.path) {
      throw new ControllerPathNotFound();
    }

    this.initialiseDecoratedRoutes();

    // get path from metadata
    if (this.initialiseRoutes && this.initialiseRoutes instanceof Function) {
      this.initialiseRoutes();
    }
  }

  initialiseDecoratedRoutes() {
    for (const httpMethod of Object.values(httpMethods)) {
      const httpMethodMetadata = Reflect.getMetadata(httpMethod, this);

      if (httpMethodMetadata && httpMethodMetadata.length) {
        httpMethodMetadata.forEach((entry: httpDecoratorMetaData) =>
          this.router[httpMethod](`${this.path}${entry.path}`, entry.fn)
        );
      }
    }
  }

  initialiseRoutes?(): void;
}
