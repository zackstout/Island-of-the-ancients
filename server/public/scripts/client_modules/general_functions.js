
const BUILD_COSTS = {
  sentry: {
    iron: 2,
    stone: 2
  },
  connector: {
    iron: 3,
    stone: 4
  },
  upgraded_nexus: {
    iron: 5,
    stone: 5
  },
  ammo: {
    iron: 3,
    stone: 1
  }
};

// ===============================================================================================

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
  if (e.length < 1) return false;
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
  // NOTE: splice mutates the input array, so there's no need to return. Should refactor:
  verts.splice(ind, 1);
}

// ===============================================================================================

// Relies on edge existing in edges:
export function findAndRemoveEdge(edges, edge) {
  let ind;
  for (let i=0; i<edges.length; i++) {
    if (edges[i][0].x == edge[0].x &&
      edges[i][0].y == edge[0].y &&
      edges[i][1].x == edge[1].x &&
      edges[i][1].y == edge[1].y) {
        ind = i;
      }
    }
    edges.splice(ind, 1);
  }

  // ===============================================================================================

  export function computeCosts(verts, edges=[]) {
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

  export function canBuild(start, projected, type) {
    const remaining_iron = start.iron - projected.iron;
    const remaining_stone = start.stone - projected.stone;
    const bool = remaining_iron >= BUILD_COSTS[type].iron && remaining_stone >= BUILD_COSTS[type].stone;
    // console.log(bool);
    return bool;
  }

  // ===============================================================================================

  export function handleVertexClick(grid, feature) {

    if (!vertexInArray(feature.location, grid.occ_vertices)) {
      // Vertex is unoccupied, or occupied by one of our staged vertices:
      if (vertexInArray(feature.location, grid.stagedVertices)) {
        findAndRemoveVertex(grid.stagedVertices, feature.location);
      } else {
        if (canBuild(grid.current_bank, grid.staged_cost, 'sentry')) {
          grid.stagedVertices.push({x: feature.location.x, y: feature.location.y, occupant: "P" + grid.player.num});
        }
      }

    } else {
      // The clicked vertex is OCCUPADO: Check to build Citadel or shoot enemy:
      console.log(grid);
      // if (feature.location.x == grid.player.nexus.x &&
      //   feature.location.y == grid.player.nexus.y &&
      //   canBuild(grid.current_bank, grid.staged_cost, 'upgraded_nexus')) {
      //     handleNexusClick(grid);
      //   } else {
      //     handleEnemyClick(grid, feature);
      //   }
      }
    }

    // ===============================================================================================

    export function handleEnemyClick(grid, feature) {
      const occ = getOccupant(feature.location, grid.occ_vertices); // 'P1' or 'P2'
      const isEnemy = occ.occupant.includes(grid.enemy.num);

      if (isEnemy) {
        if (occ.stagedToShoot && grid.armory.ammo > 0) {
          fireUpon(occ, grid);
        }
        occ.stagedToShoot = true;
      }
    }

    // ===============================================================================================

    export function handleNexusClick(grid) {
      if (grid.player.nexus.stagedForUpgrade) {
        upgradeNexus(grid);
      }
      // Will draw a different color:
      grid.player.nexus.stagedForUpgrade = true;
    }

    // ===============================================================================================

    export function fireUpon(occ, grid) {
      grid.armory --;
      findAndRemoveVertex(grid.occ_vertices, occ);
    }

    // ===============================================================================================

    export function buildAmmo(grid) {
      grid.armory ++;

      grid.staged_cost.iron += BUILD_COSTS.ammo.iron;
      grid.staged_cost.stone += BUILD_COSTS.ammo.stone;
      // WHEN IS THE DOM UPDATED?
    }

    // ===============================================================================================

    export function upgradeNexus(grid) {
      grid.player.nexus.stagedForUpgrade = false;
      grid.player.nexus.upgraded = true;

      grid.staged_cost.iron += BUILD_COSTS.upgraded_nexus.iron;
      grid.staged_cost.stone += BUILD_COSTS.upgraded_nexus.stone;
      // NOTE: there should be a way to undo this, like click again to unstage.
    }

    // ===============================================================================================

    // Relies on fact that loc is in verts:
    export function getOccupant(loc, verts) {
      for (let i=0; i<verts.length; i++) {
        if (loc.x == verts[i].x && loc.y == verts[i].y) return verts[i];
      }
    }

    // ===============================================================================================

    // ***** Maybe only allow them to build the edge if it's connected to a power source??

    export function handleEdgeClick(grid, feature) {
      if (!edgeInArray(feature.location, grid.occ_edges)) {
        if (edgeInArray(feature.location, grid.stagedEdges)) {
          findAndRemoveEdge(grid.stagedEdges, feature.location);
        } else {
          if (canBuild(grid.current_bank, grid.staged_cost, 'connector')) {
            grid.stagedEdges.push(feature.location);
          }
        }
      }
    }




    // ===============================================================================================

    export function getOwner(p1, p2) {
      if (p1 > p2) return 'P1';
      if (p2 > p1) return 'P2';
      if (p1 == p2) return null;
      else return 'Neutral';
    }

    // ===============================================================================================

    export function checkForNexus(cell, nex) {
      const verts = computeVertices(cell);
      for (let i=0; i < verts.length; i++) {
        const vtx = verts[i];
        if (vtx.x == nex.x && vtx.y == nex.y) return 1;
      }
      return 0;
    }

    // ===============================================================================================




    // ===============================================================================================

    // fun fun functions!
