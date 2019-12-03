import "reflect-metadata";
import { injector } from "../injector";
import { Injectable } from "decorators/Injectable";
import { Inject } from "decorators/Inject";

describe("injector", () => {
  // mock functions
  const ctorFake = jest.fn();
  const fieldFake = jest.fn();

  @Injectable()
  class Service {}

  class CtorUser {
    constructor(@Inject() public service: Service) {
      ctorFake(service);
    }
  }

  class FieldUser {
    @Inject() service: Service;

    method() {
      fieldFake(this.service);
    }
  }

  it("should correctly inject dependencies in constructor", () => {
    const CtorUserConstructor = injector(CtorUser, [Service]);
    new CtorUserConstructor();

    expect(ctorFake.mock.calls[0][0]).toBeInstanceOf(Service);
  });

  it("should correctly inject dependencies as class fields", () => {
    const FieldUserConstructor = injector(FieldUser, [Service]);
    const fieldUser = new FieldUserConstructor();

    fieldUser.method();

    expect(fieldFake.mock.calls[0][0]).toBeInstanceOf(Service);
  });

  // TODO error handling
});
