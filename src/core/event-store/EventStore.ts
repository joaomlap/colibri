import { IResponse } from "../application/IResponse";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IEvent } from "core/domain/IEvent";
import { serialiseEvent } from "./helpers/serialiseEvent";
import feedParser from "feedparser";
import { IEventStore } from "./IEventStore";

type EventStoreCredentials = {
  username: string;
  password: string;
};

export interface IEventStoreEvent {
  eventId: string;
  eventType: string;
  data: object;
}

export class EventStore implements IEventStore {
  url: string;
  credentials: EventStoreCredentials;
  port: number = 2113;

  constructor(url: string, credentials: EventStoreCredentials) {
    this.url = url;
    this.credentials = credentials;
  }

  async publish(aggregateId: string, events: IEvent[]) {
    const serialisedEvents = events.map(e => serialiseEvent(e));
    console.log("PUBLISH", aggregateId, events);
    return this.writeToEventStream(aggregateId, serialisedEvents);
  }

  async load(aggregateId: string) {
    return this.readEventStream(aggregateId);
  }

  private makeResponse(axiosResponse: AxiosResponse<any>) {
    switch (axiosResponse.status) {
      case Ok.statusCode:
        return new Ok();
      case TemporarilyRedirected.statusCode:
        return new TemporarilyRedirected();
      case InvalidRequest.statusCode:
        return new InvalidRequest();
      default:
        throw new Error(
          `Unexpected status code ${axiosResponse.status} returned.`
        );
    }
  }

  private async writeToEventStream(
    streamId: string,
    events: IEventStoreEvent[]
  ): Promise<IResponse> {
    console.log("STREAM ID", streamId);
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
      data: events
    } as AxiosRequestConfig;

    try {
      const response = await axios.request(options);

      return this.makeResponse(response);
    } catch (err) {
      return {
        statusCode: 500,
        data: err
      };
    }
  }

  private async readEventStream(streamId: string): Promise<any> {
    const options = {
      url: `http://${this.url}:${this.port}/streams/${streamId}`,
      method: "post",
      headers: {
        "Content-Type": "application/vnd.eventstore.events+json"
      },
      auth: {
        username: "admin",
        password: "changeit"
      }
    } as AxiosRequestConfig;

    try {
      const response = await axios.request(options);
      console.log("response", response);
      return response;
    } catch (err) {
      return {
        statusCode: 500,
        data: err
      };
    }
  }
}

export class Ok implements IResponse {
  static statusCode = 201;
  statusCode = 201;
  data = "New stream created.";
}
export class TemporarilyRedirected implements IResponse {
  static statusCode = 307;
  statusCode = 307;
  data = "Temporarily Redirect.";
}
export class InvalidRequest implements IResponse {
  static statusCode = 400;
  statusCode = 400;
  data = "Write request body invalid.";
}
