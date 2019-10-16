import { IEvent } from "./IEvent";

export interface IEventLoader {
  load(id: string): IEvent[];
}
