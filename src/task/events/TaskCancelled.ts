import { IEvent } from "core/domain/IEvent";

export class TaskCancelled implements IEvent {
  constructor(public readonly taskId: string) {}
}
