import { IEvent } from "../IEvent";
import { Result } from "Result";

export interface IEventStoreEvent {
  eventId: string;
  eventType: string;
  data: object;
}

export interface IEventStore {
  load(id: string): Promise<Result<IEventStoreEvent[]>>;
  publish(aggregateId: string, events: IEvent[]): Promise<Result<string>>;
}

export type IEventStoreResult = {
  status: number;
  description: string;
  data?: any;
};
