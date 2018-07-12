
let height, width;
// import { Grid } from './Grid.js';
console.log('what up');



window.onload = function() {
  height = 500;
  width = 500;
  let ctx = document.getElementById('island').getContext('2d');
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, width, height);
};



  // let grid = new Grid(1, 2);
  // console.log(grid);
