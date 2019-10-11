import Express from "express";

export interface IController {
  path: string;
  router: Express.Router;

  initialiseRoutes: () => void;
  // handleRequest: (req: Request) => Promise<any>;
}
