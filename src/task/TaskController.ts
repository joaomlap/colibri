import Express, { Request, Response } from "express";
import uuid from "uuid";
import { IController } from "core/application/IController";
import { CommandBus } from "../core/bus/CommandBus";
import { CreateTaskCommand, CreateTaskHandler } from "./commands/CreateTask";
import { TaskRepository } from "./TaskRepository";
import EventStore, {
  Ok,
  TemporarilyRedirected,
  InvalidRequest
} from "../core/eventStore/EventStore";

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
    const id = uuid.v4();

    const response = await this.commandBus.send(
      new CreateTaskCommand({
        id,
        type: "move"
      })
    );

    console.log("x", { response });

    switch (response.constructor) {
      case Ok:
        res.send("ok");
        break;
      case TemporarilyRedirected:
        res.status(response.statusCode);
        res.send(response.message);
        break;
      case InvalidRequest:
        res.status(response.statusCode);
        res.send(response.message);
        break;
      default:
        res.status(res.statusCode);
        res.send(`An unpredicted error ocurred: ${response.message}`);
    }
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
