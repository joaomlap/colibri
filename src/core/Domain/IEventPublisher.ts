import { IEvent } from "./IEvent";

export interface IEventPublisher {
  publish<T extends IEvent>(aggregateId: string, events: T[]): void;
}
