export class InjectingException extends Error {
  constructor() {
    super(
      `Injectable does not have a type:
        Either the injectable is not newable or you have a circular dependency injection.`
    );
  }
}
