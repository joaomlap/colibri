import { IEvent } from "core/domain/IEvent";
import { TaskDto } from "../TaskDto";

export class TaskCreated implements IEvent {
  constructor(public readonly taskDto: TaskDto) {}
}
