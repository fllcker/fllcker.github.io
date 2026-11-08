export type Point = { x: number; y: number };
export type Viewport = Point & { scale: number };

export const INITIAL_VIEW: Viewport = { x: 0, y: 0, scale: 1 };
export const MIN_SCALE = 0.5;
export const MAX_SCALE = 6;

/** Keep the diagram point under the gesture anchor fixed while scaling. */
export function transformView(view: Viewport, from: Point, to: Point, factor = 1): Viewport {
  const scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, view.scale * factor));
  const ratio = scale / view.scale;
  return {
    scale,
    x: to.x - (from.x - view.x) * ratio,
    y: to.y - (from.y - view.y) * ratio,
  };
}

export function gesture(points: Point[]): { center: Point; distance: number } {
  const [a, b = a] = points;
  return {
    center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
    distance: Math.hypot(b.x - a.x, b.y - a.y),
  };
}
