import Express from "express";
import { CommandBus } from "core/CommandBus";
import { EventBus } from "core/EventBus";

export class AppContext {
  constructor(
    public app: Express.Application,
    public commandBus: CommandBus,
    public eventBus: EventBus
  ) {}
}
