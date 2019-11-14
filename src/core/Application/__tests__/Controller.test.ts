import * as express from "express";
import { Controller } from "../Controller";
import axios from "axios";
import sinon from "sinon";
import { post } from "../decorators/http";

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

  it("works when user initialises routes", async () => {
    class SpecificController extends Controller {
      create = async () => {
        return Promise.resolve();
      };

      initialiseRoutes() {
        this.router.post("/task/create", this.create);
      }
    }

    const router = express.Router();
    const root = "/task";
    const path = "/create";

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
      @post(link)
      async create() {
        return Promise.resolve();
      }
      @post(secondLink)
      async cancel() {
        return Promise.resolve();
      }
    }

    class AnotherController extends Controller {}

    const router = express.Router();
    const otherRouter = express.Router();

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
