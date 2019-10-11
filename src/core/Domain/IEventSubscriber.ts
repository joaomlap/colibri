import { IEvent } from "./IEvent";
import { IEventHandler } from "./IEventHandler";

export interface IEventSubscriber {
  subscribe<T extends IEvent>(event: T, handler: IEventHandler<T>): void;
}
