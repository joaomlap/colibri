import "reflect-metadata";
import { Repository } from "../Repository";
import { Aggregate } from "Aggregate";
import { IEventStore, IEventStoreEvent } from "event-store/IEventStore";
import { Ok, Err } from "Result";
import { IEvent } from "IEvent";

describe("Repository", () => {
  describe("load", () => {
    it("should load an event stream and instantiate an aggregate", async () => {
      const fakeEvent: IEventStoreEvent = {
        eventId: "123",
        eventType: "nice",
        data: { awesome: "evt" }
      };
      const fakeEventStore: IEventStore = {
        load: jest.fn(() => Promise.resolve(new Ok([fakeEvent]))),
        publish: jest.fn()
      };

      class SomeAggregate extends Aggregate {
        id = "abx";
      }
      class SomeRepo extends Repository<SomeAggregate> {}

      const repo = new SomeRepo(fakeEventStore, SomeAggregate);
      const result = await repo.load("abx");

      expect(result).toBeInstanceOf(Ok);

      const aggregate = result.get();

      expect(aggregate).toBeInstanceOf(SomeAggregate);
    });

    it("should forward error", async () => {
      const fakeEventStore: IEventStore = {
        load: jest.fn(() => Promise.resolve(new Err("errrrr"))),
        publish: jest.fn()
      };

      class SomeAggregate extends Aggregate {
        id = "abx";
      }
      class SomeRepo extends Repository<SomeAggregate> {}

      const repo = new SomeRepo(fakeEventStore, SomeAggregate);
      const result = await repo.load("abx");

      expect(result).toBeInstanceOf(Err);

      const error = result.get();

      expect(error).toEqual("errrrr");
    });
  });

  describe("save", () => {
    it("should save aggregate and return it inside result", async () => {
      class SomeAggregate extends Aggregate {
        id = "abx";
      }
      const aggregate = new SomeAggregate();
      const fakeEventStore: IEventStore = {
        load: jest.fn(),
        publish: jest.fn((_: string, __: IEvent[]) =>
          Promise.resolve(new Ok(aggregate))
        )
      };

      class SomeRepo extends Repository<SomeAggregate> {}

      const repo = new SomeRepo(fakeEventStore, SomeAggregate);
      const result = await repo.save(aggregate);

      expect(result).toBeInstanceOf(Ok);
      expect(result.get()).toBeInstanceOf(SomeAggregate);
    });

    it("should forward error from event store", async () => {
      class SomeAggregate extends Aggregate {
        id = "abx";
      }
      const aggregate = new SomeAggregate();
      const fakeEventStore: IEventStore = {
        load: jest.fn(),
        publish: jest.fn((_: string, __: IEvent[]) =>
          Promise.resolve(new Err("nooo"))
        )
      };

      class SomeRepo extends Repository<SomeAggregate> {}

      const repo = new SomeRepo(fakeEventStore, SomeAggregate);
      const result = await repo.save(aggregate);

      expect(result).toBeInstanceOf(Err);
      expect(result.get()).toEqual("nooo");
    });
  });
});
