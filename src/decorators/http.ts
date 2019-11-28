import Express from "express";

export const httpMethods = Object.freeze({
  GET: "get",
  POST: "post"
} as const);

export type httpDecoratorMetaData = {
  path: string;
  fn: Express.RequestHandler;
};

function appendToPrevious(
  target: any,
  constant: string,
  metadata: httpDecoratorMetaData
) {
  return [...(Reflect.getMetadata(constant, target) || []), metadata];
}

function httpMethodDecorator(constant: string, path: string) {
  return function(target: any, _: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(
      constant,
      appendToPrevious(target, constant, { path, fn: descriptor.value }),
      target
    );
    return descriptor;
  };
}

export function Get(path: string) {
  return httpMethodDecorator(httpMethods.GET, path);
}

export function Post(path: string) {
  return httpMethodDecorator(httpMethods.POST, path);
}
