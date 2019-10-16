import { IEvent } from "core/domain/IEvent";
import { IEventStoreEvent } from "core/publisher/EventStore";
import uuid = require("uuid");

export function serialiseEvent(event: IEvent): IEventStoreEvent {
  const eventId = uuid.v4();
  const eventType = event.constructor.name;
  const data = event;

  console.log("WERNEONVOE", {
    eventId,
    eventType,
    data
  });
  return {
    eventId,
    eventType,
    data
  };
}
