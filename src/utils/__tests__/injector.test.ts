import "reflect-metadata";
import { injector } from "../injector";
import { Injectable } from "decorators/Injectable";
import { Inject } from "decorators/Inject";
import { InfiniteInjectingLoop } from "exceptions/InfiniteInjectingLoop";
import { MockService } from "./__mocks__/MockService";
import { WrongService } from "./__mocks__/WrongService";
import { InjectingException } from "exceptions/InjectingException";

describe("injector", () => {
  // mock functions
  const ctorFake = jest.fn();
  const fieldFake = jest.fn();
  const serviceFake = jest.fn();

  @Injectable()
  class Service {}

  @Injectable()
  class AnotherService {
    constructor(@Inject() service: Service) {
      serviceFake(service);
    }
  }

  class CtorUser {
    constructor(
      @Inject() public service: Service,
      @Inject() public anotherService: AnotherService
    ) {
      ctorFake(service);
      ctorFake(anotherService);
    }
  }

  class FieldUser {
    @Inject() service: Service;

    method() {
      fieldFake(this.service);
    }
  }

  it("should correctly inject dependencies in constructor", () => {
    const CtorUserConstructor = injector(CtorUser, [Service, AnotherService]);
    new CtorUserConstructor();

    expect(ctorFake.mock.calls[0][0]).toBeInstanceOf(Service);
    expect(ctorFake.mock.calls[1][0]).toBeInstanceOf(AnotherService);
  });

  it("should correctly inject dependencies as class fields", () => {
    const FieldUserConstructor = injector(FieldUser, [Service]);
    const fieldUser = new FieldUserConstructor();

    fieldUser.method();

    expect(fieldFake.mock.calls[0][0]).toBeInstanceOf(Service);
  });

  it("should correctly inject dependencies in other injectables", () => {
    const CtorUserConstructor = injector(CtorUser, [Service, AnotherService]);
    new CtorUserConstructor();

    expect(ctorFake.mock.calls[0][0]).toBeInstanceOf(Service);
    expect(ctorFake.mock.calls[1][0]).toBeInstanceOf(AnotherService);
    expect(serviceFake.mock.calls[0][0]).toBeInstanceOf(Service);
  });

  it("should not let to inject a injectable on to itself", () => {
    @Injectable()
    class BadService {
      constructor(@Inject() public ws: BadService) {}
    }
    expect(() => {
      const WrongCtor = injector(BadService, [
        Service,
        AnotherService,
        BadService
      ]);
      new WrongCtor();
    }).toThrow(InfiniteInjectingLoop);
  });

  it("should catch a circular dependency injection", () => {
    expect(() => {
      const WrongCtor = injector(MockService, [MockService, WrongService]);
      new WrongCtor();
    }).toThrow(InjectingException);
  });
});
