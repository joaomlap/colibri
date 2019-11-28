import "reflect-metadata";
import { CommandHandler, COMMAND_HANDLER } from "../commands";
import { ICommand } from "ICommand";
import { ICommandHandler } from "ICommandHandler";

describe("CommandHandler decorator", () => {
  it("should be able to define a command handler successfully", () => {
    const fakeContinuation = jest.fn();

    class FakeCommand implements ICommand {
      constructor() {
        fakeContinuation();
      }
    }
    class AnotherFakeCommand implements ICommand {
      constructor() {
        fakeContinuation();
      }
    }

    @CommandHandler(FakeCommand)
    class FakeCommandHandler implements ICommandHandler {
      execute() {
        // yeah-low
        return Promise.resolve(fakeContinuation());
      }
    }

    @CommandHandler(AnotherFakeCommand)
    class AnotherFakeCommandHandler implements ICommandHandler {
      execute() {
        // yeah-low
        return Promise.resolve(fakeContinuation());
      }
    }

    expect(Reflect.getMetadata(COMMAND_HANDLER, FakeCommandHandler)).toBe(
      FakeCommand
    );

    expect(
      Reflect.getMetadata(COMMAND_HANDLER, AnotherFakeCommandHandler)
    ).toBe(AnotherFakeCommand);
  });

  // class FakeModule extends Module {}
});
