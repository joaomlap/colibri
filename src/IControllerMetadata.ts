import Express from "express";

export interface IControllerMetadata {
  path: string;
  router?: Express.Router;
}
