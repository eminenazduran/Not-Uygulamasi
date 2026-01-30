export type Point = {
  x: number;
  y: number;
};

export type BaseElement = {
  id: string;
  color: string;
  strokeWidth: number;
};

export type PathElement = BaseElement & {
  type: "path";
  points: Point[];
};

export type RectElement = BaseElement & {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Element = PathElement | RectElement;

