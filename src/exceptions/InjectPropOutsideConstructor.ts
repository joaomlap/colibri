export class InjectPropOutsideConstructor extends Error {
  constructor() {
    super("Injecting property outside constructor.");
  }
}
