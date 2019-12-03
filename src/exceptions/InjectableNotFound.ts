export class InjectableNotFound extends Error {
  constructor(injectableName: string) {
    super(`Injectable ${injectableName} was not found.`);
  }
}
