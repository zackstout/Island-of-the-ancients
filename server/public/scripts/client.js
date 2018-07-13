
// It's clearly not going to work to make grid a global var:
let height, width, ctx, grid;
import { Grid } from './Grid.js';

const test_vertices = [{x: 10, y: 3, occupant: 'P1'}, {x: 2, y: 4, occupant: 'P1'}, {x: 3, y:3, occupant: 'P2'}, {x: 2, y: 1, occupant: 'P1'}];
const test_edges = [[{x:1, y:2}, {x:2, y:2}], [{x:1, y:3}, {x:1, y:4}]];


window.onload = function() {
  height = 500;
  width = 500;
  const canvas = document.getElementById('island');
  ctx = canvas.getContext('2d');

  grid = new Grid(height, width, 12, 12);
  console.log(grid);

  drawGrid(grid, test_vertices, test_edges);

  // Determine which cell was clicked on, find nearest vertex:
  canvas.addEventListener("click", handleClick);
};


function handleClick(e) {
  // NOTE: Will only work when canvas butts up against edge of browser, i.e. body has margin 0:
  const mouse = {x: e.clientX, y: e.clientY};
  const cell = grid.getClickedCell(mouse);
  grid.getNearestVertex(mouse);
  grid.getNearestEdge(mouse);
}


function getClickedCell(point, grid) {
  const cell_x = Math.floor(point.x / grid.cell_width);
  const cell_y = Math.floor(point.y / grid.cell_height);
  const cell = grid.findCell(cell_x, cell_y);
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

  // Pretty ugly to pass around grid like this...
  drawVertices(occupied_vertices, grid);
  drawEdges(occupied_edges, grid);

  console.log(grid.findCell(1, 2));
}


// Each vertex has x, y, and occupant:
function drawVertices(verts, grid) {
  verts.forEach(vertex => {
    ctx.fillStyle = vertex.occupant === 'P1' ? 'red' : 'blue';
    ctx.beginPath();
    ctx.arc(vertex.x * grid.cell_width, vertex.y * grid.cell_height, 10, 0, 2*Math.PI);
    ctx.fill();
  });
}


// Each edge is an array of two vertex objects:
function drawEdges(edges, grid) {
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

    const neighbors = getNeighborsOfEdge(edge, grid);
    console.log(neighbors);
  });
}



// NOTE: this is wrong for the literal edge cases:
// Get the 1 or 2 cells that border a given edge:
function getNeighborsOfEdge(edge, grid) {
  let res = [];

  // Vertical edge:
  if (edge[0].x == edge[1].x) { // edge[0] is starting vertex, edge[1] is ending vertex.
    if (edge[0].x != 0) {
      res.push(grid.findCell(edge[0].x - 1, edge[0].y));
    }
    if (edge[1].x != grid.numCellsW - 1) {
      res.push(grid.findCell(edge[0].x + 1, edge[0].y));
    }

    // Horizontal edge:
  } else if (edge[0].y == edge[1].y) {
    if (edge[0].y != 0) {
      res.push(grid.findCell(edge[0].x, edge[0].y - 1));
    }
    if (edge[1].y != grid.numCellsH - 1) {
      res.push(grid.findCell(edge[0].x, edge[0].y + 1));
    }
  }

  return res;
}























// This file will never end!
