
export function getDistance(a, b) {
  return Math.pow(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2), 0.5).toFixed(3);
}

// ===============================================================================================

export function computeVertices(cell) {
  const UL = {pos: 'UL', x: cell.x    , y: cell.y    };
  const UR = {pos: 'UR', x: cell.x + 1, y: cell.y    };
  const BL = {pos: 'BL', x: cell.x    , y: cell.y + 1};
  const BR = {pos: 'BR', x: cell.x + 1, y: cell.y + 1};
  const vertices = [UL, UR, BL, BR];
  return vertices;
}

// ===============================================================================================

export function computeEdges(cell) {
  const vertices = computeVertices(cell);
  const top    = [vertices[0], vertices[1]];
  const right  = [vertices[1], vertices[3]];
  const bottom = [vertices[2], vertices[3]];
  const left   = [vertices[0], vertices[2]];
  const edges   = [top, right, bottom, left];
  return edges;
}

// ===============================================================================================

export function vertexInArray(v, arr) {
  if (v.x == null) return null;

  for (let i=0; i < arr.length; i++) {
    if (arr[i].x == v.x && arr[i].y == v.y) return true;
  }
  return false;
}

// ===============================================================================================

// Note: this depends on convention (LRUD) being followed. Otherwise we may overlap.
export function edgeInArray(e, arr) {
  if (e.length < 1) return null;

  for (let i=0; i < arr.length; i++) {
    if (arr[i][0].x == e[0].x && arr[i][0].y == e[0].y && arr[i][1].x == e[1].x && arr[i][1].y == e[1].y) return true;
  }
  return false;
}

// ===============================================================================================

// Relies on vtx existing in verts:
export function findAndRemoveVertex(verts, vtx) {
  let ind;
  for (let i=0; i<verts.length; i++) {
    if (verts[i].x == vtx.x && verts[i].y == vtx.y) {
      ind = i;
    }
  }
  return verts.splice(ind, 1);
}

// ===============================================================================================

// Relies on edge existing in edges:
export function findAndRemoveEdge(edges, edge) {
  let ind;
  for (let i=0; i<edges.length; i++) {
    if (edges[i][0].x == edge[0].x
      && edges[i][0].y == edge[0].y
      && edges[i][1].x == edge[1].x
      && edges[i][1].y == edge[1].y) {
      ind = i;
    }
  }
  return edges.splice(ind, 1);
}

// ===============================================================================================

// Not using for now -- feature.feature works fine:
export function isVertex(feature) {
  return feature.x !== null;
}











// fun fun functions!
