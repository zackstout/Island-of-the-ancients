
let height, width, ctx;
import { Grid } from './Grid.js';



window.onload = function() {
  height = 500;
  width = 500;
  ctx = document.getElementById('island').getContext('2d');
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, width, height);


  let grid = new Grid(height, width, 12, 12);
  console.log(grid);
  drawGrid(grid);


};


function drawGrid(grid) {
  grid.squares.forEach(square => {
    let col;
    switch(square.resource) {
      case 'stone': col = 'gray'; break;
      case 'iron': col = 'brown'; break;
    }
    ctx.fillStyle = col;
    ctx.fillRect(square.x * grid.cell_height, square.y * grid.cell_width, grid.cell_width, grid.cell_height);
  });
}
