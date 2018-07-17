
const helpers = require('./helper_helpers.js');
const computeVertices = helpers.computeVertices;
const computeEdges = helpers.computeEdges;
const vertexInArray = helpers.vertexInArray;
const edgeInArray = helpers.edgeInArray;
const getDistance = helpers.getDistance;

const BUILD_COSTS = {
  sentry: {
    iron: 2,
    stone: 2
  },
  connector: {
    iron: 3,
    stone: 4
  }
};

// ===============================================================================================

// Helper function for submitMove:
function computeCosts(verts, edges) {
  let res = {
    iron: 0,
    stone: 0
  };

  res.iron += verts.reduce((sum, v) => sum + BUILD_COSTS.sentry.iron, 0);
  res.iron += edges.reduce((sum, e) => sum + BUILD_COSTS.connector.iron, 0);
  res.stone += verts.reduce((sum, v) => sum + BUILD_COSTS.sentry.stone, 0);
  res.stone += edges.reduce((sum, e) => sum + BUILD_COSTS.connector.stone, 0);

  // console.log("RESULT of REDUCING is...", res);
  return res;
}

// ===============================================================================================

function computeGains(verts, edges, cells, player) {
  // For each cell, get number of surrounding edges. Then get its owner.
  let res = {
    iron: 0,
    stone: 0
  };

  let resources_in_cells = getEachCellsResourceValue(edges, cells, player);
  let cell_owners = getEachCellsOwner(verts, cells);

  for (let i=0; i < cells.length; i++) {
    if (player.num == 1 && cell_owners[i] == 'P1') {
      res[cells[i].resource] += resources_in_cells[i];
    }
    if (player.num == 2 && cell_owners[i] == 'P2') {
      res[cells[i].resource] += resources_in_cells[i];
    }
  }

  console.log("RESULT OF GAINS: ", res);
  return res;
}

// ===============================================================================================

function getEachCellsResourceValue(occupied_edges, cells, player) {
  return cells.map(cell => {
    let res=0;
    const edges = computeEdges(cell);
    edges.forEach(edge => {
      if (edgeInArray(edge, occupied_edges)) res++;
    });
    res += checkForNexus(cell, player.nexus);
    return res;
  });
}

// ===============================================================================================

// Helper function for above method (getEachCellsResourceValue):
function checkForNexus(cell, nex) {
  const verts = computeVertices(cell);
  for (let i=0; i < verts.length; i++) {
    const vtx = verts[i];
    if (vtx.x == nex.x && vtx.y == nex.y) return 1;
  }
  return 0;
}

// ===============================================================================================

function getEachCellsOwner(verts, cells) {
  return cells.map(cell => {
    let p1 = 0;
    let p2 = 0;
    let owner;
    const vertices = computeVertices(cell);

    for (let i=0; i < vertices.length; i++) {
      const vtx = vertices[i];
      for (let j=0; j < verts.length; j++) {
        const occ = verts[j];
        if (vtx.x == occ.x && vtx.y == occ.y) {
          // We have a match:
          if (occ.occupant == 'P1') {
            p1 ++;
          } else if (occ.occupant == 'P2') {
            p2 ++;
          }
        }
      }
    }

    // Determine the owner:
    if (p1 > p2) {
      owner = 'P1';
    } else if (p2 > p1) {
      owner = 'P2';
    } else if (p1 == 0 && p2 == 0) {
      owner = null;
    } else {
      owner = 'Neutral';
    }

    return owner;
  });
}

// ===============================================================================================

// Relies on arr1 being a subset of arr2:
function getDifferenceVertices(sub_arr, arr) {
  let res = [];
  arr.forEach(v1 => {
    let contained = false;
    sub_arr.forEach(v2 => {
      if (v1.x == v2.x && v1.y == v2.y) {
        contained = true;
      }
    });
    if (!contained) {
      res.push(v1);
    }
  });
  return res;
}

// ===============================================================================================

// Relies on arr1 being a subset of arr2:
function getDifferenceEdges(sub_arr, arr) {
  let res = [];
  arr.forEach(e1 => {
    let contained = false;
    sub_arr.forEach(e2 => {
      if (e1[0].x == e2[0].x && e1[0].y == e2[0].y && e1[1].x == e2[1].x && e1[1].y == e2[1].y) {
        contained = true;
      }
    });
    if (!contained) {
      res.push(e1);
    }
  });
  return res;
}

// ===============================================================================================

module.exports = {
  getDifferenceVertices: getDifferenceVertices,
  getDifferenceEdges: getDifferenceEdges,
  computeCosts: computeCosts,
  computeGains: computeGains
};
