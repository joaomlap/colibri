import { ICommand } from "core/Domain/ICommand";
import { ICommandHandler } from "core/domain/ICommandHandler";
import { TaskStatus, TaskType, TaskUrgency, Task } from "task/TaskTypes";
import { TaskRepository } from "../TaskRepository";
import { TaskAggregate } from "../TaskAggregate";

export class CreateTaskCommand implements ICommand {
  public id: string;
  public type: TaskType;
  public status: TaskStatus;
  public urgency: TaskUrgency;

  constructor(task: Task) {
    this.id = task.id;
    this.type = task.type;
    this.status = task.status;
    this.urgency = task.urgency;
  }
}

export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(private readonly repository: TaskRepository) {}

  execute(command: CreateTaskCommand) {
    const task = new TaskAggregate();
    task.createTask(command);

    return this.repository.save(task);
  }
}
