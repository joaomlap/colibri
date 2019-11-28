export class TooManyCommandHandlersException extends Error {
  constructor() {
    super("A command must have exactly one command handler.");
  }
}
