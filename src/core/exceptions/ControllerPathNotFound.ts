export class ControllerPathNotFound extends Error {
  constructor() {
    super("No path was found for this controller.");
  }
}
