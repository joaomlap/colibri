import Express, { Request, Response } from "express";
import { Controller } from "core/Controller";
import { CommandBus } from "core/CommandBus";
import { CreateTaskCommand, CreateTaskHandler } from "./commands/CreateTask";
import { TaskRepository } from "./TaskRepository";
import { EventStore } from "../EventStore";
import { CancelTaskCommand, CancelTaskHandler } from "./commands/CancelTask";

export class TaskController extends Controller {
  public path = "/task";
  public router = Express.Router();
  private commandBus = new CommandBus();
  eventStore = new EventStore("127.0.0.1", {
    username: "admin",
    password: "changeit"
  });
  repository = new TaskRepository(this.eventStore);

  createTask = async (req: Request, res: Response) => {
    const response = await this.commandBus.send(
      new CreateTaskCommand(req.body.task)
    );

    res.status(response.status);
    res.json(response.get());
  };

  cancelTask = async (req: Request, res: Response) => {
    const response = await this.commandBus.send(
      new CancelTaskCommand(req.params.taskId)
    );

    res.status(response.status);
    res.json(response.get());
  };

  initialiseRoutes() {
    this.router.post(`${this.path}/create`, this.createTask);
    this.router.post(`${this.path}/cancel/:taskId`, this.cancelTask);
  }

  registerHandlers() {
    this.commandBus.registerHandler(
      CreateTaskCommand,
      new CreateTaskHandler(this.repository)
    );

    this.commandBus.registerHandler(
      CancelTaskCommand,
      new CancelTaskHandler(this.repository)
    );
  }
}
