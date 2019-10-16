import { Repository } from "../core/domain/Repository";
import { TaskAggregate } from "./TaskAggregate";
import { Task, TaskStatus } from "./TaskTypes";

export class TaskRepository extends Repository {
  createTask(taskData: Task) {
    const task = new TaskAggregate();
    task.createTask(taskData);

    return this.save(task);
  }

  cancelTask(id: string, taskStatus: TaskStatus) {
    this.load(id);
  }
}
