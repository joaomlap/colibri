import Express, { Request, Response } from "express";
import uuid from "uuid";
import IController from "core/application/IController";
import { CommandBus } from "core/bus/CommandBus";
import { CreateTaskCommand, CreateTaskHandler } from "./commands/CreateTask";
import { TaskRepository } from "./TaskRepository";

export default class TaskController implements IController {
  public path = "/task";
  public router = Express.Router();
  private commandBus = new CommandBus();
  repository = new TaskRepository({ publish: () => console.log("publis") });

  constructor() {
    this.initialiseRoutes();
    this.registerHandlers();
  }

  async createTask(req: Request, res: Response) {
    console.log(req);
    const id = uuid.v4();

    await this.commandBus.send(
      new CreateTaskCommand({
        id,
        type: "move"
      })
    );

    res.send("Command Created");
  }

  initialiseRoutes() {
    this.router.post(`${this.path}/`, this.createTask);
  }

  registerHandlers() {
    this.commandBus.registerHandler(
      CreateTaskCommand,
      new CreateTaskHandler(this.repository)
    );
  }
}
