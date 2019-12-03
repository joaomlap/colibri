export class UnbuildableDependency extends Error {
  constructor() {
    super(
      "Unbuildable Depencency: Ensure injectables have all the dependencies decorated with @Inject."
    );
  }
}
