import { Aggregate } from "../core/domain/Aggregate";
import { TaskDto } from "./TaskDto";
import { TaskCreated } from "./events/TaskCreated";

export class TaskAggregate extends Aggregate {
  id: string;
  type: string;
  status: string;

  constructor(public taskDto: TaskDto) {
    super();

    this.applyEvent(new TaskCreated(taskDto));
  }

  apply<TaskCreated>(taskCreated: TaskCreated): void;
  apply<TaskCancelled>(taskCancelled: TaskCancelled): void;

  apply(taskCreated: TaskCreated) {
    this.id = taskCreated.taskDto.id;
    this.type = taskCreated.taskDto.type;
  }
}
