import "reflect-metadata";
import Express from "express";
import { Get, Post, httpMethods, httpDecoratorMetaData } from "../http";
import sinon from "sinon";
import axios from "axios";

jest.mock("express", () => ({
  Router: () => ({
    get: jest.fn(),
    post: jest.fn()
  })
}));

describe("HTTP decorators", () => {
  beforeAll(() => {
    sinon.stub(axios, "get");
    sinon.stub(axios, "post");
  });

  it("exports decorators in a friendly way", async () => {
    const link = "/path";
    class TestClass {
      constructor(private router: Express.Router) {
        const getMetadata = Reflect.getMetadata(httpMethods.GET, this);

        if (getMetadata && getMetadata.length) {
          getMetadata.forEach((entry: httpDecoratorMetaData) =>
            this.router.get(entry.path, entry.fn)
          );
        }
      }

      @Get(link)
      getFn() {}
    }

    const router = Express.Router();
    new TestClass(router);

    expect(router.get).toHaveBeenCalled();

    await axios.get(link);

    expect((router.get as jest.Mock).mock.calls[0]).toContain(link);
  });

  it("allows for dynamically route creation", async () => {
    const link = "/path";
    const secondLink = "/path2";

    class TestClass {
      constructor(private router: Express.Router) {
        for (const httpMethod of Object.values(httpMethods)) {
          const httpMethodMetadata = Reflect.getMetadata(httpMethod, this);

          if (httpMethodMetadata && httpMethodMetadata.length) {
            httpMethodMetadata.forEach((entry: httpDecoratorMetaData) =>
              this.router[httpMethod](entry.path, entry.fn)
            );
          }
        }
      }

      @Get(link)
      firstGetFn() {}

      @Get(secondLink)
      secondGetFn() {}

      @Post(link)
      postFn() {}
    }

    const router = Express.Router();
    const test = new TestClass(router);

    expect(router.get).toHaveBeenCalled();
    expect(router.post).toHaveBeenCalled();

    await axios.get(link);
    await axios.get(secondLink);
    await axios.post(link);

    expect((router.get as jest.Mock).mock.calls[0][0]).toBe(link);
    expect((router.get as jest.Mock).mock.calls[0][1]).toEqual(test.firstGetFn);

    expect((router.get as jest.Mock).mock.calls[1][0]).toBe(secondLink);
    expect((router.get as jest.Mock).mock.calls[1][1]).toEqual(
      test.secondGetFn
    );

    expect((router.post as jest.Mock).mock.calls[0][0]).toBe(link);
    expect((router.post as jest.Mock).mock.calls[0][1]).toEqual(test.postFn);
  });
});
