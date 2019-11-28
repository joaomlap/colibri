import { IEvent } from "../IEvent";
import { Response } from "Response";

export interface IEventStoreEvent {
  eventId: string;
  eventType: string;
  data: object;
}

export interface IEventStore {
  load(id: string): Promise<Response<IEventStoreEvent[]>>;
  publish(aggregateId: string, events: IEvent[]): Promise<Response<string>>;
}

export type IEventStoreResponse = {
  status: number;
  description: string;
  data?: any;
};
