import Express from 'express';

export default interface IController {
  path: string;
  router: Express.Router;

  initialiseHandlers: () => void;
}