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

export class Err {
  constructor(public error: string) {}

  get() {
    return this.error;
  }

  isOk() {
    return false;
  }
}

export type Result<T> = Ok<T> | Err;
