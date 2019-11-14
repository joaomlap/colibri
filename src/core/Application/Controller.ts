import "reflect-metadata";
import Express from "express";
import { httpMethods, httpDecoratorMetaData } from "./decorators/http";

export abstract class Controller {
  constructor(public path: string, public router: Express.Router) {
    this.initialiseDecoratedRoutes();

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
