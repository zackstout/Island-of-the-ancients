
// It's clearly not going to work to make grid a global var:
let height, width, ctx, grid;
import { Grid } from './Grid.js';
import { drawGrid } from './Drawing.js';
import { generateTestEdges } from './Test.js';
import { generateTestVertices } from './Test.js';

const test_edges = generateTestEdges(50);
const test_vertices = generateTestVertices(30);

// make the variables globally available (to all modules):
window.test_edges = test_edges;
window.test_vertices = test_vertices;
console.log({test_edges},{test_vertices});
// ===============================================================================================

window.onload = function() {
  height = document.getElementById('island').height;
  width = document.getElementById('island').width;

  const canvas = document.getElementById('island');
  window.ctx = canvas.getContext('2d');

  grid = new Grid(height, width, 12, 12);
  console.log(grid);

  drawGrid(grid, test_vertices, test_edges);

  // Determine which cell was clicked on, find nearest vertex:
  canvas.addEventListener("click", handleClick);
  canvas.addEventListener("mousemove",handleMouseMove);
};

// ===============================================================================================

function handleClick(e) {
  const mouse = {x: e.offsetX, y: e.offsetY};
  const cell = grid.getClickedCell(mouse);
  grid.getNearestVertex(mouse);
  grid.getNearestEdge(mouse);
  grid.distanceToEdges(cell, mouse);
}

// ===============================================================================================

function handleMouseMove(e) {
  console.log(e);
  const mouse = {x: e.offsetX, y: e.offsetY};
  console.log(grid.detectBoardFeature(mouse));
}















// This file will never end!
