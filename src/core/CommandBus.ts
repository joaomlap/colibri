import { ICommand } from "core/ICommand";
import { ICommandHandler } from "core/ICommandHandler";
import { Type } from "core/utils/Type";
import {
  TooManyCommandHandlersException,
  CommandHandlerNotFoundException
} from "./exceptions";
import { Result } from "./Result";

type CommandType = Type<ICommand>;

export class CommandBus {
  private handlers = new Map<CommandType, ICommandHandler>();

  registerHandler(commandClass: CommandType, handler: ICommandHandler) {
    const commandAlreadyHaveHandler = this.handlers.get(commandClass);

    if (commandAlreadyHaveHandler) {
      throw new TooManyCommandHandlersException();
    }

    this.handlers.set(commandClass, handler);
  }

  async send(command: ICommand): Promise<Result<any>> {
    const commandPrototype = Object.getPrototypeOf(command);
    const commandClass = commandPrototype && commandPrototype.constructor;
    const handler = this.handlers.get(commandClass);

    if (!handler) {
      throw new CommandHandlerNotFoundException();
    }

    return handler.execute(command);
  }
}
