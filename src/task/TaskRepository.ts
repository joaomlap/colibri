import { Repository } from "../core/domain/Repository";
import { TaskAggregate } from "./TaskAggregate";

export class TaskRepository extends Repository {
  async load(aggregateId: string): Promise<TaskAggregate> {
    const task = new TaskAggregate();
    const events = await this.eventStore.load(aggregateId);
    task.loadFromStream(events);

    return task;
  }
}
