import { ObservableBus } from "utils/ObservableBus";
import { ICommand } from "ICommand";
import { Subject } from "rxjs";

describe("ObservableBus", () => {
  it("should create an observable subject", () => {
    const observableBus = new ObservableBus<ICommand>();

    expect(observableBus.subject).toBeInstanceOf(Subject);
  });
});
