
let height, width, ctx;
import { Grid } from './Grid.js';


let test_vertices = [{x: 10, y: 3, occupant: 'P1'}, {x: 2, y: 4, occupant: 'P1'}, {x: 3, y:3, occupant: 'P2'}, {x: 2, y: 1, occupant: 'P1'}];
let test_edges = [[{x:1, y:2}, {x:2,y:2}], [{x:1, y:3}, {x:1, y:4}]];

window.onload = function() {
  height = 500;
  width = 500;
  ctx = document.getElementById('island').getContext('2d');

  let grid = new Grid(height, width, 12, 12);
  console.log(grid);

  drawGrid(grid, test_vertices, test_edges);
};


function drawGrid(grid, occupied_vertices=[], occupied_edges=[]) {
  grid.cells.forEach(cell => {
    let col;
    switch(cell.resource) {
      case 'stone': col = 'gray'; break;
      case 'iron': col = 'brown'; break;
    }
    ctx.fillStyle = col;
    ctx.fillRect(cell.x * grid.cell_width, cell.y * grid.cell_height, grid.cell_width, grid.cell_height);
  });

  // Pretty ugly to pass around grid like this.
  drawVertices(occupied_vertices, grid);
  drawEdges(occupied_edges, grid);

  console.log(grid.findCell(1, 2));
}


function drawVertices(verts, grid) {
  verts.forEach(vertex => {
    ctx.fillStyle = vertex.occupant === 'P1' ? 'red' : 'blue';
    ctx.beginPath();
    ctx.arc(vertex.x * grid.cell_width, vertex.y * grid.cell_height, 10, 0, 2*Math.PI);
    ctx.fill();
  });
}

function drawEdges(edges, grid) {
  edges.forEach(edge => {
    let start_x = edge[0].x * grid.cell_width;
    let start_y = edge[0].y * grid.cell_height;
    let end_x = edge[1].x * grid.cell_width;
    let end_y = edge[1].y * grid.cell_height;

    ctx.beginPath();
    ctx.moveTo(start_x, start_y);
    ctx.lineTo(end_x, end_y);
    ctx.lineWidth = 5;
    ctx.stroke();

    let neighbors = getNeighborsOfEdge(edge, grid);
    console.log(neighbors);
  });
}

function getNeighborsOfEdge(edge, grid) {
  let res = [];

  // Vertical edge:
  if (edge[0].x == edge[1].x) { // edge[0] is starting vertex, edge[1] is ending vertex.
    if (edge[0].x != 0) {
      let cell1 = grid.findCell(edge[0].x - 1, edge[0].y);
      res.push(cell1);
    }
    if (edge[1].x != grid.numCellsW - 1) {
      let cell2 = grid.findCell(edge[0].x, edge[0].y);
      res.push(cell2);
    }
  // Horizontal edge:
  } else if (edge[0].y == edge[1].y) {
    if (edge[0].y != 0) {
      let cell3 = grid.findCell(edge[0].x, edge[0].y - 1);
      res.push(cell3);
    }
    if (edge[1].y != grid.numCellsH - 1) {
      let cell4 = grid.findCell(edge[0].x, edge[0].y);
      res.push(cell4);
    }
  }

  return res;
}
