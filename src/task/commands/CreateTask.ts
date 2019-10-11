import { ICommand } from "core/Domain/ICommand";
import { ICommandHandler } from "core/domain/ICommandHandler";
import { TaskDto } from "task/TaskDto";
import { TaskRepository } from "task/TaskRepository";

export class CreateTaskCommand implements ICommand {
  constructor(public taskDto: TaskDto) {}
}

export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(private readonly repository: TaskRepository) {}

  execute(command: CreateTaskCommand) {
    this.repository.createTask(command.taskDto);
    return new Promise(resolve => resolve("a"));
  }
}
