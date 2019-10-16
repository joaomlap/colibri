import { ICommand } from "core/Domain/ICommand";
import { ICommandHandler } from "core/domain/ICommandHandler";
import { TaskDto } from "task/TaskDto";
import { TaskRepository } from "task/TaskRepository";
import uuid = require("uuid");

export class CreateTaskCommand implements ICommand {
  public readonly id: string = uuid.v4();

  constructor(public taskDto: TaskDto) {}
}

export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(private readonly repository: TaskRepository) {}

  execute(command: CreateTaskCommand) {
    return this.repository.createTask(command.taskDto);
  }
}
