import { ICommand } from "../../../core/Domain/ICommand";
import { ICommandHandler } from "../../../core/domain/ICommandHandler";
import { TaskRepository } from "../TaskRepository";
import { TaskAggregate } from "../TaskAggregate";
import { Response, Err } from "../../../core/application/Response";
import { Aggregate } from "../../../core/domain/Aggregate";

export class CancelTaskCommand implements ICommand {
  constructor(public taskId: string) {}
}

export class CancelTaskHandler implements ICommandHandler<CancelTaskCommand> {
  constructor(private readonly repository: TaskRepository) {}

  async execute(command: CancelTaskCommand) {
    const response = await this.repository.load(command.taskId);
    let result: Response<Aggregate>;

    if (response.isOk()) {
      const task = response.get() as TaskAggregate;
      task.cancelTask();

      result = await this.repository.save(task);
    } else {
      result = new Err(response.status, response.get() as string);
    }

    return result;
  }
}
