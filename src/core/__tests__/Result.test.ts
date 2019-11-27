import { Result, Ok, Err } from "../Result";

const enum respond {
  ok,
  err
}

function makeResult(respondWith: respond): Result<object> {
  if (respondWith === respond.ok) {
    return new Ok({ a: "b" });
  } else {
    return new Err("some err");
  }
}

describe("Result<T>", () => {
  it("should create a Ok Result", () => {
    expect(makeResult(respond.ok).isOk()).toBe(true);
  });

  it("should create a Err Result", () => {
    expect(makeResult(respond.err).isOk()).toBe(false);
  });
});
