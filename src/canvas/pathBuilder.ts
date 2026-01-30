import { Skia } from "@shopify/react-native-skia";
import { Point } from "./types";

export const buildPath = (points: Point[]) => {
  const path = Skia.Path.Make();
  if (points.length < 2) return path;

  path.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];

    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;

    path.quadTo(current.x, current.y, midX, midY);
  }

  const last = points[points.length - 1];
  path.lineTo(last.x, last.y);

  return path;
};
