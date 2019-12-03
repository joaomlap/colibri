export class InfiniteInjectingLoop extends Error {
  constructor() {
    super(`Infinite injecting loop detected.`);
  }
}
