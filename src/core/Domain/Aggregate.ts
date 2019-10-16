import { IEvent } from "./IEvent";
import { Type } from "core/utils/Type";

type EventClass = Type<IEvent>;

export abstract class Aggregate {
  id: string;
  events: IEvent[] = [];
  mutators = new Map<EventClass, Function>();

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

  apply(event: IEvent) {
    const eventPrototype = Object.getPrototypeOf(event);
    const eventClass = eventPrototype && eventPrototype.constructor;
    const applyFn = this.mutators.get(eventClass);

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
}
