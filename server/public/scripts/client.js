
// It's clearly not going to work to make grid a global var:
let height, width, ctx, grid;
import { Grid } from './Grid.js';
import { drawGrid } from './Drawing.js';

const test_vertices = [{x: 10, y: 3, occupant: 'P1'}, {x: 2, y: 4, occupant: 'P1'}, {x: 3, y:3, occupant: 'P2'}, {x: 2, y: 1, occupant: 'P1'}];
const test_edges = [[{x:1, y:2}, {x:2, y:2}], [{x:1, y:3}, {x:1, y:4}]];


window.onload = function() {
  height = 500;
  width = 500;
  const canvas = document.getElementById('island');
  window.ctx = canvas.getContext('2d');

  grid = new Grid(height, width, 12, 12);
  console.log(grid);

  drawGrid(grid, test_vertices, test_edges);

  // Determine which cell was clicked on, find nearest vertex:
  canvas.addEventListener("click", handleClick);
};


function handleClick(e) {
  // NOTE: Will only work when canvas butts up against edge of browser, i.e. body has margin 0:
  // maybe we need e.screenX instead.
  const mouse = {x: e.clientX, y: e.clientY};
  const cell = grid.getClickedCell(mouse);
  grid.getNearestVertex(mouse);
  grid.getNearestEdge(mouse);
}


















// This file will never end!
