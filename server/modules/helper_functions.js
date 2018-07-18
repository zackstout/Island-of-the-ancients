
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

  return res;
}

// ===============================================================================================

// For each cell, get number of surrounding edges. Then get its owner.
function computeGains(verts, edges, cells, player) {
  let res = {
    iron: 0,
    stone: 0
  };

  let resources_in_cells = getEachCellsResourceValue(edges, cells, player);
  let cell_owners = getEachCellsOwner(verts, cells);

  for (let i=0; i < cells.length; i++) {
    if (player.num == 1 && cell_owners[i] == 'P1' ||
        player.num == 2 && cell_owners[i] == 'P2') {
      res[cells[i].resource] += resources_in_cells[i];
    }
  }

  return res;
}

// ===============================================================================================

// Update player's and enemy's bank based on previous move and current board state:
function updateBank(socket, game, new_verts, new_edges) {
  const player = socket.id == game.player1.id ? 'player1' : 'player2';
  const enemy = socket.id == game.player2.id ? 'player1' : 'player2';

  game[player].bank.iron -= computeCosts(new_verts, new_edges).iron;
  game[player].bank.stone -= computeCosts(new_verts, new_edges).stone;

  res = computeGains(game.boardState.occupied_vertices, game.boardState.occupied_edges, game.boardState.cells, game[enemy]);
  game[enemy].bank.iron += res.iron;
  game[enemy].bank.stone += res.stone;

  // For Last Harvest on client side:
  game[enemy].tempBank.iron = res.iron;
  game[enemy].tempBank.stone = res.stone;
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

    const owner = getOwner(p1, p2);
    return owner;
  });
}

function getOwner(p1, p2) {
  let owner;
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
}

// ===============================================================================================

module.exports = {
  computeCosts: computeCosts,
  computeGains: computeGains,
  BUILD_COSTS: BUILD_COSTS,
  checkForNexus: checkForNexus,
  updateBank: updateBank,
};
