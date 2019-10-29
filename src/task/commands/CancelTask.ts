import { ICommand } from "core/Domain/ICommand";
import { ICommandHandler } from "core/domain/ICommandHandler";
import { TaskRepository } from "task/TaskRepository";

export class CancelTaskCommand implements ICommand {
  constructor(public taskId: string) {}
}

export class CancelTaskHandler implements ICommandHandler<CancelTaskCommand> {
  constructor(private readonly repository: TaskRepository) {}

  async execute(command: CancelTaskCommand) {
    const task = await this.repository.load(command.taskId);
    task.cancelTask();

    return this.repository.save(task);
  }
}
