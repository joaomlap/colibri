import { CommandHandler } from "../commands";
import { ICommand } from "core/ICommand";
import { ICommandHandler } from "core/ICommandHandler";
import { Type } from "core/utils/Type";

describe("CommandHandler decorator", () => {
  it("should be able to define a command handler successfully", () => {
    const fakeContinuation = jest.fn();
    type CommandType = Type<ICommand>;

    class FakeCommand implements ICommand {
      constructor() {
        fakeContinuation();
      }
    }

    @CommandHandler(FakeCommand)
    class FakeCommandHandler implements ICommandHandler<FakeCommand> {
      execute(command: FakeCommand) {
        // yeah-low
        return Promise.resolve(fakeContinuation());
      }
    }

    const fakeModule = new FakeModule();
  });

  class FakeModule extends Module {}
});
