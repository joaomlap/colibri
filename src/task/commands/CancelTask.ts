import { ICommand } from "core/Domain/ICommand";
import { ICommandHandler } from "core/domain/ICommandHandler";
import { TaskStatus } from "task/TaskTypes";
import { TaskRepository } from "task/TaskRepository";

export class CancelTaskCommand implements ICommand {
  constructor(public taskId: string, public taskStatus: TaskStatus) {}
}

export class CancelTaskHandler implements ICommandHandler<CancelTaskCommand> {
  constructor(private readonly repository: TaskRepository) {}

  execute(command: CancelTaskCommand) {
    this.repository.cancelTask(command.taskId, command.taskStatus);
    return new Promise(resolve => {
      resolve();
    });
  }
}
