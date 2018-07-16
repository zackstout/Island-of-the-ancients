
// It's clearly not going to work to make grid a global var:
let height, width, ctx, grid;

import { Grid } from './client_modules/Grid.js';
import { drawGrid } from './client_modules/Drawing.js';
import { generateTestEdges, generateTestVertices } from './client_modules/Test.js';
import { startClickListeners } from './client_modules/Click.js';
import { socket } from './client_modules/Socket.js';

const test_edges = generateTestEdges(50);
const test_vertices = generateTestVertices(30);

// make the variables globally available (to all modules):
window.test_edges = test_edges;
window.test_vertices = test_vertices;
// console.log({test_edges},{test_vertices});
// ===============================================================================================

window.onload = function() {
  height = document.getElementById('island').height;
  width = document.getElementById('island').width;

  startClickListeners();

  const canvas = document.getElementById('island');
  window.island_canvas = canvas;
  window.ctx = canvas.getContext('2d');
  grid = new Grid(height, width, 12, 12);
  // console.log(grid);
  drawGrid(grid, test_vertices, test_edges);

  // These can't be initialized *until* there is a grid:
  $(canvas).on("click", {grid: grid}, grid.handleClick);
  $(canvas).on("mousemove", {grid: grid}, grid.handleMouseMove);
};

// ===============================================================================================













// This file will never end!
