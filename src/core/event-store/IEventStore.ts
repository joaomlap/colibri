import { IEvent } from "../domain/IEvent";

export interface IEventStore {
  load(id: string): Promise<any>;
  publish(aggregateId: string, events: IEvent[]): Promise<any>;
}
