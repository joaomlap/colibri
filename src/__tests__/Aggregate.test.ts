import { Aggregate } from "../Aggregate";
import { IEvent } from "IEvent";
import { Handle } from "decorators/Handle";

describe("Aggregate", () => {
  it("should create an empty aggregate successfully", () => {
    class MyAggregate extends Aggregate {}

    const aggregate = new MyAggregate();

    expect(aggregate.getUncommittedEvents()).toEqual([]);
  });

  describe("applyEvent", () => {
    it("should push a new event to the uncommited list", () => {
      class OneEvent implements IEvent {}
      class MyAggregate extends Aggregate {}

      const aggregate = new MyAggregate();
      const oneEvent = new OneEvent();

      aggregate.applyEvent(oneEvent);

      expect(aggregate.getUncommittedEvents()).toEqual([oneEvent]);
    });

    it("should not push an old event to the uncommited list", () => {
      class OneEvent implements IEvent {}
      class MyAggregate extends Aggregate {}

      const aggregate = new MyAggregate();
      const oneEvent = new OneEvent();

      aggregate.applyEvent(oneEvent, false);

      expect(aggregate.getUncommittedEvents()).toEqual([]);
    });
  });

  describe("mutators", () => {
    class OneEvent implements IEvent {}
    class MyAggregate extends Aggregate {}

    const aggregate = new MyAggregate();
    const oneEvent = new OneEvent();

    class MyAggregate extends Aggregate {
      @Handle(OneEvent)
      eventHandler(event: OneEvent) {}
    }
  });

  describe("loadFromStream", () => {});
});
