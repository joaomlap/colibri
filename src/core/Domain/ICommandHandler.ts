import { ICommand } from "./ICommand";
import { Response } from "../application/Response";

export interface ICommandHandler<Command extends ICommand> {
  execute(command: Command): Promise<Response<any>>;
}
