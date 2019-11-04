import { IEvent } from "core/domain/IEvent";
import { TaskType, TaskStatus, TaskUrgency } from "../TaskTypes";

export class TaskCreated implements IEvent {
  constructor(
    public id: string,
    public type: TaskType,
    public status: TaskStatus,
    public urgency: TaskUrgency
  ) {}
}
