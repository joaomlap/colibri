import { Aggregate } from "../core/domain/Aggregate";
import { Task, TaskType, TaskStatus, TaskUrgency } from "./TaskTypes";
import { TaskCreated } from "./events/TaskCreated";
import { IEvent } from "core/domain/IEvent";
import uuid = require("uuid");
import { TaskCancelled } from "./events/TaskCancelled";

export class TaskAggregate extends Aggregate {
  id: string;
  type: TaskType;
  status: TaskStatus;
  urgency: TaskUrgency;

  constructor(eventStream: IEvent[] = []) {
    super();

    // apply functions
    this.mutators.set(TaskCreated.constructor.name, this.applyTaskCreated);
    this.mutators.set(TaskCancelled.constructor.name, this.applyTaskCancelled);

    // construct from event stream
    eventStream.forEach(event => this.apply(event));
  }

  createTask(task: Task) {
    this.applyEvent(new TaskCreated(task));
  }

  cancelTask() {
    this.applyEvent(new TaskCancelled());
  }

  applyTaskCreated = (task: Task) => {
    this.id = uuid.v4();
    this.type = task.type;
    this.status = task.status;
    this.urgency = task.urgency;
  };

  applyTaskCancelled = () => {
    this.status = TaskStatus.Cancelled;
  };
}
