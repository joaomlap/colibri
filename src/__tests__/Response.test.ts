import { Response, Ok, Err } from "../Response";

const enum respond {
  ok,
  err
}

function makeResponse(respondWith: respond): Response<string> {
  if (respondWith === respond.ok) {
    return new Ok(200, "hello");
  } else {
    return new Err(404, "Not found");
  }
}

describe("Response<T, E>", () => {
  it("should create a Ok Response", () => {
    expect(makeResponse(respond.ok).isOk()).toBe(true);
  });

  it("should create a Err Response", () => {
    expect(makeResponse(respond.err).isOk()).toBe(false);
  });
});
