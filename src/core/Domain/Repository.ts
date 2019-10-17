import { Aggregate } from "./Aggregate";
import { IEventStore } from "../event-store/IEventStore";
// import { IEventPublisher } from "./IEventPublisher";
// import { IEventLoader } from "./IEventLoader";
// import { IEventPersister } from "./IEventPersister";

export abstract class Repository {
  constructor(
    private eventStore: IEventStore // private readonly persister?: IEventPersister // private readonly publisher: IEventPublisher, // private readonly loader: IEventLoader
  ) {}

  async load(aggregateId: string): Promise<Aggregate> {
    const hey = await this.eventStore.load(aggregateId);
    console.log("HEY", hey);
    return new Promise(resolve => resolve());
  }

  save<T extends Aggregate>(aggregate: T) {
    const response = this.eventStore.publish(
      aggregate.id,
      aggregate.getUncommittedEvents()
    );

    aggregate.markEventsAsCommited();

    return response;
  }
}
