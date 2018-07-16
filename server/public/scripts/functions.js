
export function getDistance(a, b) {
  return Math.pow(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2), 0.5).toFixed(3);
}

export function computeVertices(cell) {
  const UL = {pos: 'UL', x: cell.x    , y: cell.y    };
  const UR = {pos: 'UR', x: cell.x + 1, y: cell.y    };
  const BL = {pos: 'BL', x: cell.x    , y: cell.y + 1};
  const BR = {pos: 'BR', x: cell.x + 1, y: cell.y + 1};
  const vertices = [UL, UR, BL, BR];
  return vertices;
}

export function computeEdges(cell) {
  const top    = [cell.vertices[0], cell.vertices[1]];
  const right  = [cell.vertices[1], cell.vertices[3]];
  const bottom = [cell.vertices[2], cell.vertices[3]];
  const left   = [cell.vertices[0], cell.vertices[2]];
  const edges   = [top, right, bottom, left];
  return edges;
}

export function handleClick(e) {
  const mouse = {x: e.offsetX, y: e.offsetY};
  const cell = grid.getClickedCell(mouse);
  grid.getNearestVertex(mouse);
  // grid.getNearestEdge(mouse);
  grid.distanceToEdges(cell, mouse);
}
