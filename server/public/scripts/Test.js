
export function generateTestVertices(num) {
  let res = [];
  while (res.length < num) {
    const v = {
      x: Math.floor(Math.random() * 12),
      y: Math.floor(Math.random() * 12),
      occupant: Math.random() > 0.5 ? 'P1' : 'P2'
    };
    if (!vertexInArray(v, res)) res.push(v);
  }
  return res;
}

export function generateTestEdges(num) {
  let res = [];
  while (res.length < num) {
    const edge_start = {
      x: Math.floor(Math.random() * 11),
      y: Math.floor(Math.random() * 11)
    };

    const isVert = Math.random() > 0.5;
    let edge_end;
    if (isVert) {
      edge_end = {
        x: edge_start.x,
        y: edge_start.y + 1
      };
    } else {
      edge_end = {
        x: edge_start.x + 1,
        y: edge_start.y
      };
    }

    const edge = [edge_start, edge_end];

    if (!edgeInArray(edge, res)) res.push(edge);
  }
  return res;
}


function vertexInArray(v, arr) {
  for (let i=0; i < arr.length; i++) {
    if (arr[i].x == v.x && arr[i].y == v.y) return true;
  }
  return false;
}

// Note: this depends on convention (LRUD) being followed. Otherwise we may overlap.
function edgeInArray(e, arr) {
  for (let i=0; i < arr.length; i++) {
    if (arr[i][0].x == e[0].x && arr[i][0].y == e[0].y && arr[i][1].x == e[1].x && arr[i][1].y == e[1].y) return true;
  }
  return false;
}
