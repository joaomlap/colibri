import { Aggregate } from "./Aggregate";
import { IEventStore } from "../event-store/IEventStore";
// import { IEventPublisher } from "./IEventPublisher";
// import { IEventLoader } from "./IEventLoader";
// import { IEventPersister } from "./IEventPersister";

export abstract class Repository {
  constructor(
    private eventStore: IEventStore // private readonly persister?: IEventPersister // private readonly publisher: IEventPublisher, // private readonly loader: IEventLoader
  ) {}

  load(aggregateId: string) {
    this.eventStore.load(aggregateId);
  }

  save<T extends Aggregate>(aggregate: T) {
    console.log("SAVE", aggregate);
    const response = this.eventStore.publish(
      aggregate.id,
      aggregate.getUncommittedEvents()
    );

    aggregate.markEventsAsCommited();

    return response;
  }
}
