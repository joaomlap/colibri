import { ICommand } from "../ICommand";
import { Type } from "utils/Type";
import { ICommandHandler } from "../ICommandHandler";

export const COMMAND_HANDLER = "__commandHandler__";

type CommandHandlerType = Type<ICommandHandler>;

export function CommandHandler(command: ICommand) {
  return function(target: CommandHandlerType) {
    Reflect.defineMetadata(COMMAND_HANDLER, command, target);
  };
}
