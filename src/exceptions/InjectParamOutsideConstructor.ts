export class InjectParamOutsideConstructor extends Error {
  constructor() {
    super("Injecting parameter outside constructor.");
  }
}
