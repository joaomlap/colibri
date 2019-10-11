import Express from "express";
import IController from "core/application/IController";

export default class App {
  public app: Express.Application;
  public port: number;

  constructor(
    port: number,
    middlewares: Express.RequestHandler[],
    controllers?: IController[]
  ) {
    this.app = Express();
    this.port = port;

    this.initialiseMiddlewares(middlewares);
    this.initialiseControllers(controllers);
  }

  private initialiseMiddlewares(middlewares: Express.RequestHandler[] = []) {
    this.app.use(...middlewares);
  }

  private initialiseControllers(controllers: IController[] = []) {
    controllers.forEach(controller => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on port ${this.port}...`);
    });
  }
}
