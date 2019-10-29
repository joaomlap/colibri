import { IEvent } from "../domain/IEvent";
import { Response } from "core/application/Response";

export interface IEventStoreEvent {
  eventId: string;
  eventType: string;
  data: object;
}

export interface IEventStore {
  load(id: string): Promise<Response<IEvent[]>>;
  publish(aggregateId: string, events: IEvent[]): Promise<Response<string>>;
}

export type IEventStoreResponse = {
  status: number;
  description: string;
  data?: any;
};
