import "reflect-metadata"
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
    it("should set the mutators correctly", () => {
      const fakeFn = jest.fn();
      class OneEvent implements IEvent {}
  
      class MyAggregate extends Aggregate {
        @Handle(OneEvent)
        eventHandler(_: OneEvent) {
          fakeFn();
        }
      }
  
      const aggregate = new MyAggregate();
      const oneEvent = new OneEvent();
  
      aggregate.applyEvent(oneEvent);
  
      expect(fakeFn).toHaveBeenCalled();
    });
  });

  // TODO
  describe("serialised events", () => {
    describe("applySerialisedEvent", () => {
      it("should apply event serialised events correctly", () => {

      })
    })
    describe("loadFromEventStream", () => {
      it("should load and apply events correctly", () => {})
    })
  });
});
