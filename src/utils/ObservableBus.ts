import { Observable, Subject } from "rxjs";

export class ObservableBus<T> extends Observable<T> {
  subject = new Subject<T>();

  constructor() {
    super();
  }
}
