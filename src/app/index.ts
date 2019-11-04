import App from "./App";
import bodyParser from "body-parser";
import { TaskController } from "./task/TaskController";

function main() {
  const port = parseInt(process.env.PORT || "4000", 10);
  const middlewares = [bodyParser.json()];
  const controllers = [new TaskController()];

  const app = new App(port, middlewares, controllers);
  app.listen();
}

main();
