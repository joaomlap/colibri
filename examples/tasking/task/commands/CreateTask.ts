import { ICommand } from "core/ICommand";
import { ICommandHandler } from "core/ICommandHandler";
import { TaskStatus, TaskType, TaskUrgency, Task } from "../TaskTypes";
import { TaskRepository } from "../TaskRepository";
import { TaskAggregate } from "../TaskAggregate";
import uuid = require("uuid");

export class CreateTaskCommand implements ICommand {
  public id: string;
  public type: TaskType;
  public status: TaskStatus;
  public urgency: TaskUrgency;

  constructor(task: Task) {
    this.id = uuid.v4();
    this.type = task.type;
    this.status = task.status;
    this.urgency = task.urgency;
  }
}

export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(private readonly repository: TaskRepository) {}

  async execute(command: CreateTaskCommand) {
    const task = new TaskAggregate();
    task.createTask(command);

    return this.repository.save(task);
  }
}
