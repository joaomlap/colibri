import Express, { Request } from "express";

export default interface IController {
  path: string;
  router: Express.Router;

  initialiseRoutes: () => void;
  // handleRequest: (req: Request) => Promise<any>;
}
