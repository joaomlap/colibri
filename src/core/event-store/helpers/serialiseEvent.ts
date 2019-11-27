import { IEvent } from "core/IEvent";
import { IEventStoreEvent } from "../IEventStore";
import uuid = require("uuid");

export function serialiseEvent(event: IEvent): IEventStoreEvent {
  const eventId = uuid.v4();
  const eventType = event.constructor.name;
  const data = event;

  return {
    eventId,
    eventType,
    data
  };
}
