import "reflect-metadata";
import { Repository } from "../Repository";
import { Aggregate } from "Aggregate";
import { IEventStore, IEventStoreEvent } from "event-store/IEventStore";
import { Ok } from "Result";

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
  });
});
