import { Response, Ok, Err } from "../application/Response";
import axios, { AxiosRequestConfig } from "axios";
import { IEvent } from "core/domain/IEvent";
import { serialiseEvent } from "./helpers/serialiseEvent";
import FeedParser from "feedparser";
import { IEventStore, IEventStoreEvent } from "./IEventStore";

type EventStoreCredentials = {
  username: string;
  password: string;
};

function getEventFromLink(
  options: AxiosRequestConfig
): Promise<IEventStoreEvent> {
  return new Promise(async resolve => {
    const eventLinkResponse = await axios.request(options);
    if (eventLinkResponse && eventLinkResponse.status === 200) {
      const data = eventLinkResponse.data;

      if (data && data.content) {
        const event = {
          eventId: data.content.eventId,
          eventType: data.content.eventType,
          data: data.content.data
        };

        resolve(event);
      }
    }
  });
}

export class EventStore implements IEventStore {
  url: string;
  credentials: EventStoreCredentials;
  port: number = 2113;

  constructor(url: string, credentials: EventStoreCredentials) {
    this.url = url;
    this.credentials = credentials;
  }

  async publish(
    aggregateId: string,
    events: IEvent[]
  ): Promise<Response<string>> {
    const serialisedEvents = events.map(e => serialiseEvent(e));
    return this.writeToEventStream(aggregateId, serialisedEvents);
  }

  async load(aggregateId: string) {
    return this.readEventStream(aggregateId);
  }

  private async writeToEventStream(
    streamId: string,
    events: IEventStoreEvent[]
  ): Promise<Response<string>> {
    const options = {
      url: `http://${this.url}:${this.port}/streams/task-${streamId}`,
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
    let result: Response<string> = new Err(500, "An unexpected error occurred");

    try {
      const response = await axios.request(options);
      if (response.status === 201) {
        result = new Ok(201, "Stream Created");
      } else if (response.status === 307) {
        result = new Ok(307, "Redirected");
      }
    } catch (err) {
      if (err.isAxiosError) {
        const { response } = err;

        result = new Err(response.status, response.statusText);
      }
    }

    return result;
  }

  private readEventStream = async (
    streamId: string
  ): Promise<Response<IEventStoreEvent[]>> => {
    const options = {
      url: `http://${this.url}:${this.port}/streams/task-${streamId}`,
      method: "get",
      headers: {
        Accept: "application/atom+xml"
      },
      auth: {
        username: "admin",
        password: "changeit"
      },
      responseType: "stream"
    } as AxiosRequestConfig;

    try {
      const response = await axios.request(options);
      const parser = new FeedParser({});
      await response.data.pipe(parser);

      return new Promise(resolve => {
        const promises: Promise<IEventStoreEvent>[] = [];

        parser.on("readable", async function(this: any) {
          let event;
          const stream: any = this;

          while ((event = stream.read())) {
            const options = {
              url: event.link,
              method: "get",
              headers: {
                Accept: "application/vnd.eventstore.atom+json"
              },
              auth: {
                username: "admin",
                password: "changeit"
              }
            } as AxiosRequestConfig;
            try {
              promises.push(getEventFromLink(options));
            } catch (err) {
              if (err.isAxiosError) {
                const { response } = err;
                resolve(new Err(response.status, response.statusText));
              } else {
                resolve(new Err(500, `An unexpected error occurred. ${err}`));
              }
            }
          }
        });
        parser.on("end", async function() {
          const events = await Promise.all(promises);
          resolve(new Ok(200, events));
        });
        parser.on("error", function(err: any) {
          if (err.isAxiosError) {
            const { response } = err;
            resolve(new Err(response.status, response.statusText));
          } else {
            resolve(
              new Err(500, `An unexpected error occurred: ${err.message}`)
            );
          }
        });
      });
    } catch (err) {
      if (err.isAxiosError) {
        const { response } = err;
        return new Err(response.status, response.statusText);
      } else {
        return new Err(500, `An unexpected error occurred: ${err.message}`);
      }
    }
  };
}
