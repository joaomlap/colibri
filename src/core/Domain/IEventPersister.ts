import { IEvent } from "./IEvent";

export interface IEventPersister {
  persistEvent<T extends IEvent>(event: T): void;
  persistEvents<T extends IEvent[]>(events: T): void;
}
