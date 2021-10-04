import { IShape } from "./IShape";

export interface ILine extends IShape {
  points?: number[];
  tension?: number;
  closed?: boolean;
  bezier?: boolean;
}
