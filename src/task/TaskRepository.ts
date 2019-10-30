import { Repository } from "../core/domain/Repository";
import { Response, Ok, Err } from "../core/application/Response";
import { TaskAggregate } from "./TaskAggregate";
import { IEventStoreEvent } from "core/event-store/IEventStore";

export class TaskRepository extends Repository {
  async load(aggregateId: string): Promise<Response<TaskAggregate>> {
    let result: Response<TaskAggregate>;
    const response = await this.eventStore.load(aggregateId);
    console.log("repo", response.get());

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
