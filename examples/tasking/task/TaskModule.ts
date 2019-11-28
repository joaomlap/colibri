import Express, { Request, Response } from "express";
import { Controller } from "core/Controller";
import { CommandBus } from "core/CommandBus";
import { CreateTaskCommand, CreateTaskHandler } from "./commands/CreateTask";
import { TaskRepository } from "./TaskRepository";
import { EventStore } from "../EventStore";
import { CancelTaskCommand, CancelTaskHandler } from "./commands/CancelTask";

export class TaskModule extends Controller {
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
