import Express, { Request, Response } from "express";
import { Controller } from "core/application/Controller";
import { CommandBus } from "core/bus/CommandBus";
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
