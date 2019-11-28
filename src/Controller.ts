import { Router } from "express";
import { httpMethods, httpDecoratorMetaData } from "./decorators/http";

export class Controller {
  constructor(public path: string, public router: Router = Router()) {
    this.initialiseDecoratedRoutes();
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
}
