import { Vector2d } from "./types";
import { Node } from "./Node";

export interface INode {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  visible?: boolean;
  listening?: boolean;
  id?: string;
  name?: string;
  opacity?: Number;
  scale?: Vector2d;
  scaleX?: number;
  scaleY?: number;
  rotation?: number;
  rotationDeg?: number;
  offset?: Vector2d;
  offsetX?: number;
  offsetY?: number;
  draggable?: boolean;
  dragDistance?: number;
  preventDefault?: boolean;
}
