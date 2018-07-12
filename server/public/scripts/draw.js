
let height, width;
// import { Grid } from './Grid.js';
console.log('what up');

export default function draw(){
  height = 500;
  width = 500;
  let ctx = document.getElementById('island').getContext('2d');
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, width, height);
}




  // let grid = new Grid(1, 2);
  // console.log(grid);
