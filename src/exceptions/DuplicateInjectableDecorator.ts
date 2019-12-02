export class DuplicateInjectableDecorator extends Error {
  constructor() {
    super("Duplicate use of Injectable decorator detected.");
  }
}
