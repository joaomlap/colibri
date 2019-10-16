import { ICommand } from "core/Domain/ICommand";
import { ICommandHandler } from "core/domain/ICommandHandler";
import { Type } from "core/utils/Type";
import {
  TooManyCommandHandlersException,
  CommandHandlerNotFoundException
} from "../exceptions";

type CommandType = Type<ICommand>;

export class CommandBus {
  private handlers = new Map<Type<ICommand>, ICommandHandler<ICommand>>();

  registerHandler<T extends ICommand>(
    commandClass: CommandType,
    handler: ICommandHandler<T>
  ) {
    const commandAlreadyHaveHandler = this.handlers.get(commandClass);

    if (commandAlreadyHaveHandler) {
      throw new TooManyCommandHandlersException();
    }

    this.handlers.set(commandClass, handler);
  }

  send<T extends ICommand>(command: T): Promise<any> {
    const commandPrototype = Object.getPrototypeOf(command);
    const commandClass = commandPrototype && commandPrototype.constructor;
    const handler = this.handlers.get(commandClass);

    if (!handler) {
      throw new CommandHandlerNotFoundException();
    }

    return handler.execute(command);
  }
}
