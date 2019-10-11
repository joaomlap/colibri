import { Repository } from "core/domain/Repository";
import { TaskAggregate } from "./TaskAggregate";
import { TaskDto } from "./TaskDto";

export class TaskRepository extends Repository {
  createTask(taskDto: TaskDto) {
    const task = new TaskAggregate(taskDto);
    this.save(task);
  }
}
