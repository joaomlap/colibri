import { Aggregate } from "../core/domain/Aggregate";
import { Task, TaskType, TaskStatus, TaskUrgency } from "./TaskTypes";
import { TaskCreated } from "./events/TaskCreated";
import { IEvent } from "core/domain/IEvent";
import uuid = require("uuid");

export class TaskAggregate extends Aggregate {
  id: string;
  type: TaskType;
  status: TaskStatus;
  urgency: TaskUrgency;

  constructor(eventStream: IEvent[] = []) {
    super();

    // apply functions
    this.mutators.set(TaskCreated, this.applyTaskCreated);

    // construct from event stream
    eventStream.forEach(event => this.apply(event));
  }

  createTask(task: Task) {
    this.applyEvent(new TaskCreated(task));
  }

  applyTaskCreated = (task: Task) => {
    this.id = uuid.v4();
    this.type = task.type;
    this.status = task.status;
    this.urgency = task.urgency;
  };
}
