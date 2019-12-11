import { IEvent } from "../IEvent";
import { Type } from "utils/Type";

export const AGGREGATE_EVENT_HANDLER = "__AggregateEventHandler__";
export type EventClass = Type<IEvent>;

function getEventClassName(Event: EventClass) {
  return Event && Event.name
}

function newEventHandlerMap(
  target: object,
  Event: EventClass,
  descriptor: PropertyDescriptor
) {
  let map = Reflect.getMetadata(AGGREGATE_EVENT_HANDLER, target);
  const key = getEventClassName(Event);

  if (!map) {
    map = new Map<string, PropertyDescriptor>();
  } else if (map.get(Event)) {
    // TODO proper exception
    throw new Error("Duplicate event handler");
  } else if (!key) {
    throw new Error("Improper Handle decorator use")
  }

  map.set(key, descriptor.value);

  return map;
}

export function Handle(Event: EventClass) {
  return function(target: object, _: string, descriptor: PropertyDescriptor) {
    const map = newEventHandlerMap(target, Event, descriptor);

    Reflect.defineMetadata(AGGREGATE_EVENT_HANDLER, map, target);

    return descriptor;
  };
}
