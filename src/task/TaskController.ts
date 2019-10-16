import Express, { Request, Response } from "express";
import { IController } from "core/application/IController";
import { CommandBus } from "../core/bus/CommandBus";
import { CreateTaskCommand, CreateTaskHandler } from "./commands/CreateTask";
import { TaskRepository } from "./TaskRepository";
import { EventStore } from "../core/event-store/EventStore";
import { CancelTask } from "./commands/CancelTask";

export class TaskController implements IController {
  public path = "/task";
  public router = Express.Router();
  private commandBus = new CommandBus();
  eventStore = new EventStore("127.0.0.1", {
    username: "admin",
    password: "changeit"
  });
  repository = new TaskRepository(this.eventStore);

  constructor() {
    this.initialiseRoutes();
    this.registerHandlers();
  }

  createTask = async (req: Request, res: Response) => {
    console.log("CONTROLLER", req.body);
    const response = await this.commandBus.send(
      new CreateTaskCommand(req.body.task)
    );

    res.status(response.statusCode);
    res.json(response.data);
  };

  cancelTask = async (req: Request, res: Response) => {
    const response = await this.commandBus.send(
      new CancelTask(req.params.taskId, req.body.taskStatus)
    );

    res.status(response.statusCode);
    res.json(response.data);
  };

  initialiseRoutes() {
    this.router.post(`${this.path}/create`, this.createTask);
    this.router.post(`${this.path}/updateStatus/:taskId`, this.cancelTask);
  }

  registerHandlers() {
    this.commandBus.registerHandler(
      CreateTaskCommand,
      new CreateTaskHandler(this.repository)
    );
  }
}
