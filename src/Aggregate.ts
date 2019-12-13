import { IEvent } from "./IEvent";
import { IEventStoreEvent } from "event-store/IEventStore";
import { AGGREGATE_EVENT_HANDLER } from "decorators/Handle";

export class Aggregate {
  id: string;
  protected events: IEvent[] = [];
  protected mutators = new Map<string, Function>();

  constructor(eventStream: IEvent[] = []) {
    const eventHandlersMap = Reflect.getMetadata(
      AGGREGATE_EVENT_HANDLER,
      this
    );

    if (eventHandlersMap && eventHandlersMap instanceof Map) {
      this.mutators = eventHandlersMap;
    }

    // construct from event stream
    eventStream.forEach(event => this.apply(event));
  }

  private _version: number;

  get version() {
    return this._version;
  }

  set version(v) {
    this._version = v;
  }

  getUncommittedEvents(): IEvent[] {
    return this.events;
  }

  markEventsAsCommited() {
    this.events = [];
  }

  publish(_event: IEvent) {}

  commit() {
    this.events.forEach(event => this.publish(event));
    this.markEventsAsCommited();
  }

  loadFromStream(events: IEvent[]) {
    events.forEach(e => this.applyEvent(e, false));
  }

  private apply(event: IEvent) {
    const eventClassName = event && event.constructor && event.constructor.name;
    const applyFn = this.mutators.get(eventClassName);

    if (applyFn && typeof applyFn === "function") {
      applyFn(event);
    }
  }

  applyEvent(event: IEvent, isNew = true) {
    if (isNew) {
      this.events.push(event);
    }

    this.apply(event);
  }

  // Serialised Events
  loadFromEventStream(serialisedEvts: IEventStoreEvent[]) {
    serialisedEvts.forEach(e => this.applySerialisedEvent(e));
  }

  applySerialisedEvent(serialisedEvt: IEventStoreEvent) {
    const applyFn = this.mutators.get(serialisedEvt.eventType);

    if (applyFn && typeof applyFn === "function") {
      applyFn(serialisedEvt.data);
    }
  }
}
