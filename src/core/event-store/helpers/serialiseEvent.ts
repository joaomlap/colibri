import { IEvent } from "core/domain/IEvent";
import { IEventStoreEvent } from "core/event-store/EventStore";
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
