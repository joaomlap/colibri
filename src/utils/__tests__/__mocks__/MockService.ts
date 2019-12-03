import { Injectable } from "decorators/Injectable";
import { Inject } from "decorators/Inject";
import { WrongService } from "./WrongService";

@Injectable()
export class MockService {
  constructor(@Inject() public aws: WrongService) {}
}
