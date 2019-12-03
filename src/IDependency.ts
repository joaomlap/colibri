import { INewable } from "INewable";

export interface IDependency {
  propertyKey: string;
  propertyType: INewable;
  propertyIndex?: number;
}
