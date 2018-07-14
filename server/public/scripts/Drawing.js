

// should be a method of the grid:

export function drawGrid(grid, occupied_vertices=[], occupied_edges=[]) {
  let ctx = window.ctx;

  grid.cells.forEach(cell => {
    let col;
    switch(cell.resource) {
      case 'stone': col = 'gray'; break;
      case 'iron': col = 'brown'; break;
      case 'gem': col = 'plum'; break;
    }
    ctx.fillStyle = col;
    ctx.fillRect(cell.x * grid.cell_width, cell.y * grid.cell_height, grid.cell_width, grid.cell_height);
  });

  // Pretty ugly to pass around grid like this...
  drawOccupiedEdges(occupied_edges, grid);
  drawOccupiedVertices(occupied_vertices, grid);
  drawNumOccupiedEdgesPerCell(grid); // WE're overloading this function
}

// ===============================================================================================

// Each vertex has x, y, and occupant:
function drawOccupiedVertices(verts, grid) {
  verts.forEach(vertex => {
    ctx.fillStyle = vertex.occupant === 'P1' ? 'red' : 'blue';
    ctx.beginPath();
    ctx.arc(vertex.x * grid.cell_width, vertex.y * grid.cell_height, 10, 0, 2*Math.PI);
    ctx.fill();
  });
}

// ===============================================================================================

// Each edge is an array of two vertex objects:
function drawOccupiedEdges(edges, grid) {
  edges.forEach(edge => {
    const start_x = edge[0].x * grid.cell_width;
    const start_y = edge[0].y * grid.cell_height;
    const end_x = edge[1].x * grid.cell_width;
    const end_y = edge[1].y * grid.cell_height;

    ctx.beginPath();
    ctx.moveTo(start_x, start_y);
    ctx.lineTo(end_x, end_y);
    ctx.lineWidth = 5;
    ctx.stroke();

    const neighbors = grid.getNeighborsOfEdge(edge);
    // console.log(neighbors);
  });
}

// ===============================================================================================

function drawNumOccupiedEdgesPerCell(grid) {
  grid.getOccupiedEdgesOfEachCell(window.test_edges);
  grid.getEachCellsOwner(window.test_vertices);
  grid.getNextHarvest();

  grid.cells.forEach(cell => {
    const text_x = cell.x * grid.cell_width + grid.cell_width/2;
    const text_y = cell.y * grid.cell_height + grid.cell_height/2;

    // console.log(cell.resource);

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
