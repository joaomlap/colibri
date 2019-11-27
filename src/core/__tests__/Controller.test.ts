import Express from "express";
import { Controller } from "../Controller";
import axios from "axios";
import sinon from "sinon";
import { Post } from "../decorators/http";

jest.mock("express", () => ({
  Router: () => ({
    post: jest.fn()
  })
}));

describe("Controller", () => {
  beforeAll(() => {
    sinon.stub(axios, "post");
    sinon.stub(axios, "get");
  });

  it("works when user sets path", async () => {
    const root = "/task";
    const path = "/create";
    const router = Express.Router();

    class SpecificController extends Controller {
      @Post(path)
      async create() {
        return Promise.resolve();
      }
    }

    new SpecificController(root, router);

    await axios.post("/task/create");

    expect((router.post as jest.Mock).mock.calls[0]).toContain(
      `${root}${path}`
    );
  });

  it("initialises decorated routes properly", async () => {
    const root = "/root";
    const secondRoot = "/root2";
    const link = "/path";
    const secondLink = "/path2";

    class SpecificController extends Controller {
      @Post(link)
      async create() {
        return Promise.resolve();
      }
      @Post(secondLink)
      async cancel() {
        return Promise.resolve();
      }
    }

    class AnotherController extends Controller {}

    const router = Express.Router();
    const otherRouter = Express.Router();

    new SpecificController(root, router);
    new AnotherController(secondRoot, otherRouter);

    await axios.post(`${root}/${link}`);
    await axios.post(`${root}/${secondLink}`);

    expect((router.post as jest.Mock).mock.calls[0]).toContain(
      `${root}${link}`
    );
    expect((router.post as jest.Mock).mock.calls[1]).toContain(
      `${root}${secondLink}`
    );
    expect(otherRouter.post).not.toHaveBeenCalled();
  });
});
