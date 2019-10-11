import { IEvent } from "core/domain/IEvent";
import { IEventPublisher } from "core/domain/IEventPublisher";
import { IEventSubscriber } from "core/domain/IEventSubscriber";
import { IEventHandler } from "core/domain/IEventHandler";
// import { IEventBus } from "core/domain/IEventPersister";
// import { ObservableBus } from "core/utils/ObservableBus";

export class EventBus {
  constructor(
    private publisher: IEventPublisher,
    private subscriber: IEventSubscriber
  ) {}

  publish<T extends IEvent>(aggregateId: string, event: T) {
    return this.publisher.publish(aggregateId, event);
  }

  bind<T extends IEvent>(event: T, handler: IEventHandler<T>) {
    this.subscriber.subscribe(event, handler);
  }
}
