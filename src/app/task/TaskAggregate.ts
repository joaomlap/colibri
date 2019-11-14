import { Aggregate } from "core/domain/Aggregate";
import { Task, TaskType, TaskStatus, TaskUrgency } from "./TaskTypes";
import { IEvent } from "core/domain/IEvent";
import { TaskCreated } from "./events/TaskCreated";
import { TaskCancelled } from "./events/TaskCancelled";
import { Type } from "core/utils/Type";

type EventClass = Type<IEvent>;

export class TaskAggregate extends Aggregate {
  id: string;
  type: TaskType;
  status: TaskStatus;
  urgency: TaskUrgency;

  constructor(eventStream: IEvent[] = []) {
    super();

    // apply functions
    this.mutators.set(this.getClassName(TaskCreated), this.applyTaskCreated);
    this.mutators.set(
      this.getClassName(TaskCancelled),
      this.applyTaskCancelled
    );

    // construct from event stream
    eventStream.forEach(event => this.apply(event));
  }

  createTask(task: Task) {
    this.applyEvent(
      new TaskCreated(task.id, task.type, task.status, task.urgency)
    );
  }

  cancelTask() {
    this.applyEvent(new TaskCancelled());
  }

  applyTaskCreated = (task: Task) => {
    this.id = task.id;
    this.type = task.type;
    this.status = task.status;
    this.urgency = task.urgency;
  };

  applyTaskCancelled = () => {
    this.status = TaskStatus.Cancelled;
  };

  getClassName(classFn: EventClass) {
    return classFn.prototype.constructor.name;
  }
}
