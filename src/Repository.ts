import { Aggregate } from "./Aggregate";
import { IEventStore, IEventStoreEvent } from "./event-store/IEventStore";
import { Result, Ok, Err } from "./Result";
import { Type } from "utils/Type";

export class Repository<A extends Aggregate> {
  constructor(
    protected eventStore: IEventStore,
    protected AggregateCtor: Type<A>
  ) {}

  async load(aggregateId: string): Promise<Result<A>> {
    let result: Result<A>;

    const response = await this.eventStore.load(aggregateId);

    if (response.isOk()) {
      const events = response.get() as IEventStoreEvent[];
      const aggregate = new this.AggregateCtor();
      aggregate.loadFromEventStream(events);
      result = new Ok(aggregate as A);
    } else {
      result = new Err(response.get() as string);
    }

    return result;
  }

  async save<T extends A>(aggregate: T): Promise<Result<A>> {
    const response = await this.eventStore.publish(
      aggregate.id,
      aggregate.getUncommittedEvents()
    );
    let result: Result<A>;

    if (response.isOk()) {
      result = new Ok(aggregate);
    } else {
      result = new Err(response.get() as string);
    }

    aggregate.markEventsAsCommited();

    return result;
  }
}
