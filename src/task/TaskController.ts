import Express, { Request, Response } from "express";
import { IController } from "core/application/IController";
import { CommandBus } from "../core/bus/CommandBus";
import { CreateTaskCommand, CreateTaskHandler } from "./commands/CreateTask";
import { TaskRepository } from "./TaskRepository";
import { EventStore } from "../core/publisher/EventStore";

export class TaskController implements IController {
  public path = "/task";
  public router = Express.Router();
  private commandBus = new CommandBus();
  repository = new TaskRepository(
    new EventStore("127.0.0.1", {
      username: "admin",
      password: "changeit"
    })
  );

  constructor() {
    this.initialiseRoutes();
    this.registerHandlers();
  }

  createTask = async (req: Request, res: Response) => {
    const response = await this.commandBus.send(
      new CreateTaskCommand(req.body.taskDto)
    );

    res.status(response.statusCode);
    res.json(response.data);
  };

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
