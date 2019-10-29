export class Ok<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  get() {
    return this.value;
  }

  isOk() {
    return true;
  }
}

export class Err<E> {
  error: E;

  constructor(error: E) {
    this.error = error;
  }

  get() {
    return this.error;
  }

  isOk() {
    return false;
  }
}

export type Result<T, E> = Ok<T> | Err<E>;
