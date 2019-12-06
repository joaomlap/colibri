import { IEvent } from "../IEvent";
import { Type } from "utils/Type";

export const AGGREGATE_EVENT_HANDLER = "__AggregateEventHandler__";
type EventClass = Type<IEvent>;
type Descriptor = TypedPropertyDescriptor<Function>;
// create a map by event?
// event: function?
function newEventHandlerMap(
  target: object,
  Event: EventClass,
  descriptor: Descriptor
) {
  let map = Reflect.getMetadata(AGGREGATE_EVENT_HANDLER, target);

  if (!map) {
    map = new Map<EventClass, Descriptor>();
  } else if (map.get(Event)) {
    throw new Error("Duplicate event handler");
  }

  map.set(Event, descriptor);

  return map;
}

export function Handle(Event: EventClass) {
  return function(target: object, _: string, descriptor: Descriptor) {
    const map = newEventHandlerMap(target, Event, descriptor);

    Reflect.defineMetadata(AGGREGATE_EVENT_HANDLER, map, target);
  };
}
