import { ICommand } from "core/Domain/ICommand";
import { ICommandHandler } from "core/domain/ICommandHandler";
import { Task } from "task/TaskTypes";
import { TaskRepository } from "task/TaskRepository";

export class CreateTaskCommand implements ICommand {
  constructor(public task: Task) {}
}

export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(private readonly repository: TaskRepository) {}

  execute(command: CreateTaskCommand) {
    return this.repository.createTask(command.task);
  }
}
