
// ===============================================================================================

// Now sensitive to BOTH player's nexuses:
function isNexus(vtx, grid) {
  return (vtx.x == grid.player.nexus.x && vtx.y == grid.player.nexus.y) || (vtx.x == grid.enemy.nexus.x && vtx.y == grid.enemy.nexus.y);
}

// ===============================================================================================

// Each vertex has x, y, and occupant:
export function drawOccupiedVertices(verts, grid) {
  verts.forEach(vertex => {
    ctx.fillStyle = vertex.occupant === 'P1' ? 'red' : 'blue';

    if (isNexus(vertex, grid)) {
      if (grid.player.nexus.stagedForUpgrade) ctx.fillStyle = 'purple';
      if (grid.player.nexus.upgraded) ctx.fillStyle = 'pink';
      ctx.lineWidth = 1;
      drawPentagon(vertex.x * grid.cell_width, vertex.y * grid.cell_height, 10);
    }
    else {
      if (vertex.stagedToShoot) ctx.fillStyle = 'yellow';
      ctx.beginPath();
      ctx.arc(vertex.x * grid.cell_width, vertex.y * grid.cell_height, 10, 0, 2*Math.PI);
      ctx.fill();
    }
  });
}

// ===============================================================================================

// Each edge is an array of two vertex objects:
export function drawOccupiedEdges(edges, grid) {
  edges.forEach(edge => {
    const start_x = edge[0].x * grid.cell_width;
    const start_y = edge[0].y * grid.cell_height;
    const end_x = edge[1].x * grid.cell_width;
    const end_y = edge[1].y * grid.cell_height;

    ctx.beginPath();
    ctx.moveTo(start_x, start_y);
    ctx.lineTo(end_x, end_y);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.stroke();
  });
}

// ===============================================================================================

export function drawEachCellsResourceGeneration(grid, occ_edges=[], occ_verts=[]) {

  // Ugly but will handle draw for first drawing, AND for on click.
  if (occ_edges.length > 0) {
    grid.getEachCellsResourceValue(occ_edges);
    grid.getEachCellsOwner(occ_verts, grid.cells);
  } else {
    grid.getEachCellsResourceValue(grid.occ_edges);
    grid.getEachCellsOwner(grid.occ_vertices, grid.cells);
  }

  grid.cells.forEach(cell => {
    const text_x = cell.x * grid.cell_width + grid.cell_width/2;
    const text_y = cell.y * grid.cell_height + grid.cell_height/2;
    ctx.fillStyle = getColor(cell.owner);
    ctx.fillText(cell.numOccEdges, text_x, text_y);
  });
}

// ===============================================================================================

function getColor(player) {
  if (player == 'P1') {
    return 'red';
  } else if (player == 'P2') {
    return 'blue';
  } else {
    return 'black';
  }
}

// ===============================================================================================

export function drawStagedVertices(verts, grid) {
  if (verts.length < 1) {
    return;
  } else {
    verts.forEach(vertex => {
      ctx.fillStyle = 'green';
      ctx.beginPath();
      ctx.arc(vertex.x * grid.cell_width, vertex.y * grid.cell_height, 10, 0, 2*Math.PI);
      ctx.fill();
    });
  }
}

// ===============================================================================================

function drawPentagon(x, y, r) {
  const angle = Math.PI * 2 / 5;
  ctx.beginPath();
  ctx.moveTo(x + Math.cos(angle * 0     - Math.PI/2) * r, y + Math.sin(angle * 0     - Math.PI/2) * r);

  for (let i=0; i < 5; i ++) {
    ctx.lineTo(x + Math.cos(angle * (i+1) - Math.PI/2) * r, y + Math.sin(angle * (i+1) - Math.PI/2) * r);
    ctx.stroke();
  }
  ctx.closePath();
  ctx.fill();
}

// ===============================================================================================

export function drawStagedEdges(edges, grid) {
  if (edges.length < 1) {
    return;
  } else {
    edges.forEach(edge => {
      const start_x = edge[0].x * grid.cell_width;
      const start_y = edge[0].y * grid.cell_height;
      const end_x = edge[1].x * grid.cell_width;
      const end_y = edge[1].y * grid.cell_height;

      ctx.beginPath();
      ctx.moveTo(start_x, start_y);
      ctx.lineTo(end_x, end_y);
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 5;
      ctx.stroke();
    });
  }
}

// ===============================================================================================
