import { IEvent } from "core/domain/IEvent";

export interface IEventStoreResponse {
  statusCode: number;
  message: string;
}

export interface IEventStore {
  // createEventStream: () => Event[];
  publish: (
    aggregateId: string,
    events: IEvent[]
  ) => Promise<IEventStoreResponse>;
  // publishEvent: (event: Event) => Response;
  // getEventStream: () => Event[];
  // more
}

export interface IEventStoreEvent {
  eventId: string;
  eventType: string;
  data: object;
}
