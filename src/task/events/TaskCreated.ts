import { IEvent } from "core/domain/IEvent";
import { Task } from "../TaskTypes";

export class TaskCreated implements IEvent {
  constructor(public task: Task) {}
}
