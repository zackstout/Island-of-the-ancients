
// It's clearly not going to work to make grid a global var:
let height, width, ctx, grid;
import { Grid } from './Grid.js';


let test_vertices = [{x: 10, y: 3, occupant: 'P1'}, {x: 2, y: 4, occupant: 'P1'}, {x: 3, y:3, occupant: 'P2'}, {x: 2, y: 1, occupant: 'P1'}];
let test_edges = [[{x:1, y:2}, {x:2, y:2}], [{x:1, y:3}, {x:1, y:4}]];


window.onload = function() {
  height = 500;
  width = 500;
  const canvas = document.getElementById('island');
  ctx = canvas.getContext('2d');

  grid = new Grid(height, width, 12, 12);
  console.log(grid);

  drawGrid(grid, test_vertices, test_edges);

  // Determine which cell was clicked on:
  canvas.addEventListener("click", handleClick);
};

function getDistance(a, b) {
  return Math.pow(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2), 0.5);
}

function handleClick(e) {
  // NOTE: Will only work when canvas butts up against edge of browser:
  let mouse = {x: e.clientX, y: e.clientY};

  let cell_x = Math.floor(mouse.x / grid.cell_width);
  let cell_y = Math.floor(mouse.y / grid.cell_height);

  let cell = grid.findCell(cell_x, cell_y);


  // Get nearest vertex to clicked point:
  let vertices = cell.computeVertices().map(v => {
    let res = {x: v.x * grid.cell_width, y: v.y * grid.cell_height};
    return res;
  });

  let minDist = 1000;
  let closestVertex = {};

  vertices.forEach(v => {
    let d = getDistance(mouse, v);
    if (d < minDist) {
      minDist = d;
      closestVertex.x = Math.round(v.x / grid.cell_width);
      closestVertex.y = Math.round(v.y / grid.cell_height);
    }
  });

  console.log(cell, closestVertex);



  return cell;
}

// I want to put these inside the Grid constructor -- but can ctx be easily accessed from there?
function drawGrid(grid, occupied_vertices=[], occupied_edges=[]) {
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


// Get the 1 or 2 cells that border a given edge:
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
