abstract class ResponseOptions {
  status: number;

  abstract isOk(): boolean;
  abstract get(): any;
}

export class Ok<T> extends ResponseOptions {
  data: T;

  constructor(status: number, data: T) {
    super();
    this.status = status;
    this.data = data;
  }

  isOk = () => true;

  get() {
    return this.data;
  }
}

export class Err extends ResponseOptions {
  message: string;

  constructor(status: number, message: string) {
    super();
    this.status = status;
    this.message = message;
  }

  isOk = () => false;

  get() {
    return this.message;
  }
}

export type Response<T> = Ok<T> | Err;
