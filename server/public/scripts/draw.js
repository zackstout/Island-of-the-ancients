
let height, width, ctx;
import { Grid } from './Grid.js';


let test_vertices = [{x: 10, y: 3, occupant: 'P1'}, {x: 2, y: 4, occupant: 'P1'}, {x: 3, y:3, occupant: 'P2'}, {x: 2, y: 1, occupant: 'P1'}];
let test_edges = [[{x:1, y:2}, {x:2,y:2}], [{x:1, y:3}, {x:1, y:4}]];

window.onload = function() {
  height = 500;
  width = 500;
  ctx = document.getElementById('island').getContext('2d');
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, width, height);


  let grid = new Grid(height, width, 12, 12);
  console.log(grid);
  drawGrid(grid);

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

  occupied_vertices.forEach(vertex => {
    ctx.fillStyle = vertex.occupant === 'P1' ? 'red' : 'blue';
    ctx.beginPath();
    ctx.arc(vertex.x * grid.cell_width, vertex.y * grid.cell_height, 10, 0, 2*Math.PI);
    ctx.fill();
  });

  occupied_edges.forEach(edge => {
    let start_x = edge[0].x * grid.cell_width;
    let start_y = edge[0].y * grid.cell_height;
    let end_x = edge[1].x * grid.cell_width;
    let end_y = edge[1].y * grid.cell_height;
    ctx.beginPath();
    ctx.moveTo(start_x, start_y);
    ctx.lineTo(end_x, end_y);
    ctx.lineWidth = 5;
    ctx.stroke();

    getNeighborsOfEdge();
  });
}

function getNeighborsOfEdge(edge) {

}
