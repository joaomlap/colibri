import { ICommand } from "./ICommand";
import { Result } from "./Result";

export interface ICommandHandler {
  execute(command: ICommand): Promise<Result<any>>;
}
