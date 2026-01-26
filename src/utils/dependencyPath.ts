export interface Point {
  x: number;
  y: number;
}

export function generateBezierPath(from: Point, to: Point): string {
  const dx = to.x - from.x;
  const midX = from.x + dx / 2;

  if (dx > 0) {
    return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
  } else {
    const offset = 30;
    const verticalOffset = from.y < to.y ? 20 : -20;

    return `M ${from.x} ${from.y}
            C ${from.x + offset} ${from.y},
              ${from.x + offset} ${from.y + verticalOffset},
              ${from.x + offset} ${from.y + verticalOffset}
            L ${to.x - offset} ${to.y - verticalOffset}
            C ${to.x - offset} ${to.y - verticalOffset},
              ${to.x - offset} ${to.y},
              ${to.x} ${to.y}`;
  }
}

export function getArrowMarkerDef(): string {
  return `
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
      </marker>
    </defs>
  `;
}
