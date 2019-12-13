import { IEvent } from "../IEvent";
import { Result } from "Result";
import { Aggregate } from "Aggregate";

export interface IEventStoreEvent {
  eventId: string;
  eventType: string;
  data: object;
}

export interface IEventStore {
  load(id: string): Promise<Result<IEventStoreEvent[]>>;
  publish(aggregateId: string, events: IEvent[]): Promise<Result<Aggregate>>;
}

export type IEventStoreResult = {
  status: number;
  description: string;
  data?: any;
};
