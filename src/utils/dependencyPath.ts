export interface Point {
  x: number;
  y: number;
}

export function generateBezierPath(from: Point, to: Point): string {
  const radius = 8; // Radius for rounded corners
  const horizontalOffset = 20; // How far to go horizontally before turning

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (dx > horizontalOffset * 2 + radius * 2) {
    // Simple case: target is to the right with enough space
    // Go right, then down/up, then right to target
    const midX = from.x + dx / 2;

    if (Math.abs(dy) < radius * 2) {
      // Almost same level - straight line
      return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
    }

    const dirY = dy > 0 ? 1 : -1;

    return `M ${from.x} ${from.y}
            L ${midX - radius} ${from.y}
            Q ${midX} ${from.y}, ${midX} ${from.y + radius * dirY}
            L ${midX} ${to.y - radius * dirY}
            Q ${midX} ${to.y}, ${midX + radius} ${to.y}
            L ${to.x} ${to.y}`;
  } else {
    // Complex case: target is to the left or close
    // Go right, down/up outside both bars, then left to target
    const rightOffset = horizontalOffset;
    const leftOffset = horizontalOffset;
    const dirY = dy > 0 ? 1 : -1;

    if (Math.abs(dy) < radius * 2) {
      // Same level but going backwards
      const verticalEscape = 40;
      return `M ${from.x} ${from.y}
              L ${from.x + rightOffset - radius} ${from.y}
              Q ${from.x + rightOffset} ${from.y}, ${from.x + rightOffset} ${from.y + verticalEscape * dirY || verticalEscape}
              L ${from.x + rightOffset} ${from.y + verticalEscape}
              Q ${from.x + rightOffset} ${from.y + verticalEscape + radius}, ${from.x + rightOffset - radius} ${from.y + verticalEscape + radius}
              L ${to.x - leftOffset + radius} ${from.y + verticalEscape + radius}
              Q ${to.x - leftOffset} ${from.y + verticalEscape + radius}, ${to.x - leftOffset} ${from.y + verticalEscape + radius - radius}
              L ${to.x - leftOffset} ${to.y + radius}
              Q ${to.x - leftOffset} ${to.y}, ${to.x - leftOffset + radius} ${to.y}
              L ${to.x} ${to.y}`;
    }

    return `M ${from.x} ${from.y}
            L ${from.x + rightOffset - radius} ${from.y}
            Q ${from.x + rightOffset} ${from.y}, ${from.x + rightOffset} ${from.y + radius * dirY}
            L ${from.x + rightOffset} ${to.y - radius * dirY}
            Q ${from.x + rightOffset} ${to.y}, ${from.x + rightOffset - radius} ${to.y}
            L ${to.x} ${to.y}`;
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
