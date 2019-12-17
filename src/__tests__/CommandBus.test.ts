import { CommandBus } from "../CommandBus";
import { ICommand } from "ICommand";
import { ICommandHandler } from "ICommandHandler";

describe("CommandBus", () => {
  it("should create a command bus, register a handler and send commands successfuly", () => {
    const fakeFn = jest.fn();
    class OneCommand implements ICommand {}
    class OneCommandHandler implements ICommandHandler {
      execute(_: ICommand) {
        return Promise.resolve(fakeFn());
      }
    }
    const commandBus = new CommandBus();

    commandBus.registerHandler(OneCommand, new OneCommandHandler());
    commandBus.send(new OneCommand());

    expect(fakeFn).toHaveBeenCalled();
  });
});
