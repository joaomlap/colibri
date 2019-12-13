import { Repository } from "core/Repository";
import { Response, Ok, Err } from "core/Response";
import { TaskAggregate } from "./TaskAggregate";
import { IEventStoreEvent } from "core/event-store/IEventStore";
import { Aggregate } from "core/Aggregate";

export class TaskRepository extends Repository {
  async load(aggregateId: string): Promise<Response<Aggregate>> {
    let result: Response<TaskAggregate>;
    const response = await this.eventStore.load(aggregateId);
    if (response.isOk()) {
      const events = response.get() as IEventStoreEvent[];
      const task = new TaskAggregate();
      task.loadFromEventStream(events);
      result = new Ok(response.status, task);
    } else {
      result = new Err(response.status, response.get() as string);
    }
    return result;
  }
}
