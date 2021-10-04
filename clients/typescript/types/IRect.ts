import { IShape } from "./IShape";

export interface IRect extends IShape {
  cornerRadius?: number | number[];
}
