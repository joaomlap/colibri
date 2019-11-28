import Express from "express";
import { CommandBus } from "CommandBus";
import { EventBus } from "EventBus";

export class AppContext {
  constructor(
    public app: Express.Application,
    public commandBus: CommandBus,
    public eventBus: EventBus
  ) {}
}
