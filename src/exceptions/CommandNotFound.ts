export class CommandNotFoundException extends Error {
  constructor() {
    super("There is no command with this name registered.");
  }
}
