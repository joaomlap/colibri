import { IEvent } from "IEvent";
import { serialiseEvent } from "../serialiseEvent";

describe("serialiseEvent", () => {
  it("should create a serialised event", () => {
    class OneEvent implements IEvent {
      hello = "world";
    }

    const serialisedEvent = serialiseEvent(new OneEvent());
    expect(serialisedEvent.eventType).toEqual("OneEvent");
    expect(serialisedEvent.data).toEqual({ hello: "world" });
  });
});
