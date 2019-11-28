import { Aggregate } from "./Aggregate";
import { IEventStore } from "./event-store/IEventStore";
import { Response, Ok, Err } from "./Response";

export abstract class Repository {
  constructor(protected eventStore: IEventStore) {}

  abstract async load(aggregateId: string): Promise<Response<Aggregate>>;

  async save<T extends Aggregate>(aggregate: T): Promise<Response<Aggregate>> {
    const response = await this.eventStore.publish(
      aggregate.id,
      aggregate.getUncommittedEvents()
    );
    let result: Response<Aggregate>;

    if (response.isOk()) {
      result = new Ok(response.status, aggregate);
    } else {
      result = new Err(response.status, response.get());
    }

    aggregate.markEventsAsCommited();

    return result;
  }
}
