import { Aggregate } from "./Aggregate";
import { IEventPublisher } from "./IEventPublisher";

export abstract class Repository {
  constructor(private readonly publisher: IEventPublisher) {}

  save<T extends Aggregate>(aggregate: T) {
    this.publisher.publish(aggregate.id, aggregate.getUncommittedEvents());
  }
}
