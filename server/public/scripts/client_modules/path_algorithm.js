
import { edgeInArray } from '../functions.js';

const endpoints = [{x: 1, y: 1}, {x: 0, y: 3}];
const connectors = [[{x: 1, y: 1}, {x: 1, y: 2}], [{x: 1, y: 2}, {x: 1, y: 3}], [{x: 1, y: 3}, {x: 0, y: 3}], [{x: 1, y: 0}, {x: 1, y: 1}], [{x: 0, y: 0}, {x: 1, y: 0}], [{x: 1, y: 1}, {x: 2, y: 1}]];

// ===============================================================================================

// Convert RL to LR and BU to UB (Yuck):
export function getStandardEdge(edge) {
  if (edge[0].x == edge[1].x) {
    // Vertical:
    if (edge[0].y > edge[1].y) {
      const temp = edge[0].y;
      edge[0].y = edge[1].y;
      edge[1].y = temp;
    }
  } else {
    // Horizontal:
    if (edge[0].x > edge[1].x) {
      const temp = edge[0].x;
      edge[0].x = edge[1].x;
      edge[1].x = temp;
    }
  }
  return edge;
}

// ===============================================================================================

export function getOtherPoint(point, edge) {
  if (edge[0].x == point.x && edge[0].y == point.y) return edge[1];
  else return edge[0];
}

// ===============================================================================================

// I see the problem: this is to find a CELL's edges, not the edges adjacent to a VERTEX -- THAT'S why there are always four of them!
export function computeEdges(vtx) {
  // Just leave the negatives for now:
  return [
    [{x: vtx.x - 1, y: vtx.y    }, {x: vtx.x    , y: vtx.y    }],
    [{x: vtx.x    , y: vtx.y    }, {x: vtx.x + 1, y: vtx.y    }],
    [{x: vtx.x    , y: vtx.y - 1}, {x: vtx.x    , y: vtx.y    }],
    [{x: vtx.x    , y: vtx.y    }, {x: vtx.x    , y: vtx.y + 1}],
  ];
}

// ===============================================================================================

export function areConnected(v1, v2, occ_edges, path=[], checked=[]) {
  occ_edges = occ_edges.map(e => getStandardEdge(e));

  // Exit condition:
  const edges1 = computeEdges(v1);
  const edges2 = computeEdges(v2);
  for (let i=0; i < edges1.length; i++) {
    for (let j=0; j < edges2.length; j++) {
      const e = edges1[i];
      const e2 = edges2[j];
      if (edgeInArray(e, checked) && edgeInArray(e2, checked)) {
        console.log('yeaaa');
        return path;
      }
    }
  }

  // Dead end:
  while (checkForImportantEdges(v1, occ_edges, checked).length == 0) {
    // don't think this is quite correct:
    if (path.length == 0) {
      console.log('aha');
      return false;
    }
    const prevEdge = path.pop();
    const prevPoint = getOtherPoint(v1, prevEdge);
    v1 = prevPoint;
  }

  const important_edges = checkForImportantEdges(v1, occ_edges, checked);

  for (let i=0; i < important_edges.length; i++) {
    let edge = important_edges[i];
    edge = getStandardEdge(edge);
    const other = getOtherPoint(v1, edge);

    // Two arrays: one tracks current path, one tracks all visited edges.
    path.push(edge);
    checked.push(edge);

    return areConnected(other, v2, occ_edges, path, checked);
  }
}

// ===============================================================================================

export function checkForImportantEdges(vtx, occ_edges, checked) {
  return computeEdges(vtx).filter(e => edgeInArray(e, occ_edges)).filter(e => !edgeInArray(e, checked));
}

// ===============================================================================================

const res = areConnected(endpoints[0], endpoints[1], connectors);

console.log(res, endpoints, connectors);
