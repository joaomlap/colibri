import {
  IEventStore,
  IEventStoreResponse,
  IEventStoreEvent
} from "./IEventStore";
import axios, { AxiosRequestConfig } from "axios";
import { IEvent } from "core/domain/IEvent";
import { serialiseEvent } from "core/eventStore/helpers/serialiseEvent";

type EventStoreCredentials = {
  username: string;
  password: string;
};

export default class EventStore implements IEventStore {
  url: string;
  credentials: EventStoreCredentials;
  port: number = 2113;

  constructor(url: string, credentials: EventStoreCredentials) {
    this.url = url;
    this.credentials = credentials;
  }

  async saveEvents(aggregateId: string, events: IEvent[]) {
    const serialisedEvents = events.map(e => serialiseEvent(e));

    return this.writeToEventStream(aggregateId, serialisedEvents);
  }

  private async writeToEventStream(
    streamId: string,
    events: IEventStoreEvent[]
  ): Promise<IEventStoreResponse> {
    const options = {
      url: `http://${this.url}:${this.port}/streams/${streamId}`,
      method: "post",
      headers: {
        "Content-Type": "application/vnd.eventstore.events+json"
      },
      auth: {
        username: "admin",
        password: "changeit"
      },
      data: JSON.stringify(events)
    } as AxiosRequestConfig;

    try {
      const response = await axios.request(options);

      switch (response.status) {
        case Ok.statusCode:
          return new Ok();
        case TemporarilyRedirected.statusCode:
          return new TemporarilyRedirected();
        case InvalidRequest.statusCode:
          return new InvalidRequest();
        default:
          throw new Error(
            `Unexpected status code ${response.status} returned.`
          );
      }
    } catch (err) {
      return {
        statusCode: 500,
        message: err
      };
    }
  }
}

class Ok implements IEventStoreResponse {
  static statusCode = 201;
  statusCode = 201;
  message = "New stream created.";
}
class TemporarilyRedirected implements IEventStoreResponse {
  static statusCode = 307;
  statusCode = 307;
  message = "Temporarily Redirect.";
}
class InvalidRequest implements IEventStoreResponse {
  static statusCode = 201;
  statusCode = 201;
  message = "Write request body invalid.";
}
