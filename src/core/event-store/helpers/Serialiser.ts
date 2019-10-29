import uuid from "uuid";
import { IEventStoreEvent } from "../EventStore";
import { IEvent } from "../../domain/IEvent";
import { Type } from "../../utils/Type";

type EventClass = Type<IEvent>;

export class Serialiser {
  private map = new Map<string, EventClass>();

  constructor(private events: IEvent[]) {
    events.forEach(e => {
      const eventPrototype = Object.getPrototypeOf(e);
      const eventClass = eventPrototype && eventPrototype.constructor;
      const eventClassString = eventPrototype && eventPrototype.constructor;

      this.map.set(eventClassString, eventClass);
    });
  }

  serialiseEvent(event: IEvent): IEventStoreEvent {
    const eventId = uuid.v4();
    const eventType = event.constructor.name;
    const data = event;

    return {
      eventId,
      eventType,
      data
    };
  }

  deserialiseEvent(serialisedEvt: IEventStoreEvent): IEvent {
    const eventClassString = serialisedEvt.eventType;
    const Event = this.map.get(eventClassString);

    return new Event(serialisedEvt.data);
  }
}
