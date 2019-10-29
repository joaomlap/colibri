import { IEvent } from "./IEvent";

export abstract class Aggregate {
  id: string;
  events: IEvent[] = [];
  mutators = new Map<string, Function>();

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
}
