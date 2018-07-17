
// ===============================================================================================

// Each vertex has x, y, and occupant:
export function drawOccupiedVertices(verts, grid) {
  verts.forEach(vertex => {
    ctx.fillStyle = vertex.occupant === 'P1' ? 'red' : 'blue';
    ctx.beginPath();
    ctx.arc(vertex.x * grid.cell_width, vertex.y * grid.cell_height, 10, 0, 2*Math.PI);
    ctx.fill();
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

    // const neighbors = grid.getNeighborsOfEdge(edge);
    // console.log(neighbors);
  });
}

// ===============================================================================================

export function drawEachCellsResourceGeneration(grid) {
  // "get" seems inappropriate: really we're telling it to update the Grid's state...
  grid.getEachCellsResourceValue(grid.occ_edges);
  grid.getEachCellsOwner(grid.occ_vertices);
  // grid.getNextHarvest();

  grid.cells.forEach(cell => {
    const text_x = cell.x * grid.cell_width + grid.cell_width/2;
    const text_y = cell.y * grid.cell_height + grid.cell_height/2;

    if (cell.owner == 'P1') {
      ctx.fillStyle = 'red';
    } else if (cell.owner == 'P2') {
      ctx.fillStyle = 'blue';
    } else {
      ctx.fillStyle = 'black';
    }

    ctx.fillText(cell.numOccEdges, text_x, text_y);
  });
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
