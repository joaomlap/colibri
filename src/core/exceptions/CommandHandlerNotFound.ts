export class CommandHandlerNotFoundException extends Error {
  constructor() {
    super("No command handler was found for this command.");
  }
}
