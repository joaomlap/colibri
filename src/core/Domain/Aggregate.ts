import { IEvent } from "./IEvent";

export abstract class Aggregate {
  id: string;

  events: IEvent[] = [];
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

  applyEvent(event: IEvent, isNew = true) {
    if (isNew) {
      this.events.push(event);
    }

    this.apply(event);
  }

  apply<T extends IEvent>(_event: T) {}
}
