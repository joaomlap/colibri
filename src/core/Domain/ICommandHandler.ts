import { ICommand } from "./ICommand";

export interface ICommandHandler<Command extends ICommand> {
  execute(command: Command): Promise<any>;
}
