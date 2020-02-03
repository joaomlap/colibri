import Express from "express";
import { App } from "../../src/App";
import bodyParser from "body-parser";
import { Module } from "../../src/Module";

function main() {
  const expressApp = Express();
  const middlewares = [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false })
  ];
  const Tasking = new Module();
  const app = new App({ expressApp, middlewares, modules: [Tasking] });

  app.listen(3001, () => console.log("Server running on port 3001"));
}

main();
