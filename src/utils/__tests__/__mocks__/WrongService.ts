import { Injectable } from "decorators/Injectable";
import { Inject } from "decorators/Inject";
import { MockService } from "./MockService";

@Injectable()
export class WrongService {
  constructor(@Inject() public aws: MockService) {}
}
