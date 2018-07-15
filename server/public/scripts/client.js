
// It's clearly not going to work to make grid a global var:
let height, width, ctx, grid;

import { Grid } from './Grid.js';
import { drawGrid } from './Drawing.js';
import { generateTestEdges, generateTestVertices } from './Test.js';

// ===============================================================================================

window.onload = function() {
  height = document.getElementById('island').height;
  width = document.getElementById('island').width;

  const canvas = document.getElementById('island');
  ctx = canvas.getContext('2d');
  window.ctx = ctx;

  grid = new Grid(height, width, 12, 12);
  console.log(grid);

  const test_edges = generateTestEdges(50, grid);
  const test_vertices = generateTestVertices(30, grid);

  // make the variables globally available (to all modules):
  window.test_edges = test_edges;
  window.test_vertices = test_vertices;


  drawGrid(grid, test_vertices, test_edges);

  // Determine which cell was clicked on, find nearest vertex:
  canvas.addEventListener("click", handleClick);
  // canvas.addEventListener("onmousemove", moveMouse);

  canvas.onmousemove = moveMouse;
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

function moveMouse(e) {
  const mouse = {x: e.offsetX, y: e.offsetY};
  const cell = grid.getClickedCell(mouse);

  const distances = grid.distanceToEdges(cell, mouse);

  const threshhold = 8;

  let filtered = [];

  for (let i=0; i < distances.length; i++) {
    if (distances[i] < threshhold) {
      filtered.push(cell.edges[i]);
    }
  }

  let result;

  // We have an edge, and filtered is it:
  if (filtered.length == 1) {
    result = filtered[0];
  }

  // We have a vertex, and filtered is a pair of edges:
  if (filtered.length == 2) {
    const edge1 = getCommonLetter(filtered[0][0].pos, filtered[0][1].pos);
    const edge2 = getCommonLetter(filtered[1][0].pos, filtered[1][1].pos);
    const vertex = getProperOrder(edge1 + edge2);
    // console.log(_.concat(edge1, edge2), vertex);
    result = _.find(cell.vertices, {pos: vertex});
  }

  // console.log(filtered, result);


  drawGrid(grid, test_vertices, test_edges);

  const w = grid.cell_width;
  const h = grid.cell_height;

  // Edge:
  if (filtered.length == 1) {
    ctx.beginPath();
    ctx.moveTo(result[0].x * w, result[0].y * h);
    ctx.lineTo(result[1].x * w, result[1].y * h);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'green';
    ctx.stroke();
  }

  // Vertex:
  if (filtered.length == 2) {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(result.x * w, result.y * h, 10, 0, 2*Math.PI);
    ctx.fill();
  }
}


// Returns the letter denoting an edge, e.g. "U" for upper:
function getCommonLetter(str1, str2) {
  const letters = ["U", "R", "B", "L"];
  // console.log(str1, str2);
  // letters.forEach(l => {
  //   if (str1.includes(l) && str2.includes(l)) return l;
  // });
  for (let i=0; i < letters.length; i++) {
    const l = letters[i];
    if (str1.includes(l) && str2.includes(l)) {
      return l;
    }
  }
}

function getProperOrder(str) {
  switch(str) {
    case "RU": return "UR";
    case "RB": return "BR";
    case "LU": return "UL";
    case "LB": return "BL";
    default: return str;
  }
}












// This file will never end!
