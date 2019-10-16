import { ICommand } from "core/Domain/ICommand";
import { ICommandHandler } from "core/domain/ICommandHandler";
import { TaskStatus } from "task/TaskTypes";
import { TaskRepository } from "task/TaskRepository";

export class CancelTask implements ICommand {
  constructor(public taskId: string, public taskStatus: TaskStatus) {}
}

export class CreateTaskHandler implements ICommandHandler<CancelTask> {
  constructor(private readonly repository: TaskRepository) {}

  execute(command: CancelTask) {
    return this.repository.cancelTask(command.taskId, command.taskStatus);
  }
}
