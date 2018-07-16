
// It's clearly not going to work to make grid a global var:
let height, width, ctx, grid;

import { startClickListeners } from './client_modules/click_events.js';
import { socket } from './client_modules/socket_connection.js';

// ===============================================================================================

window.onload = function() {
  height = document.getElementById('island').height;
  width = document.getElementById('island').width;

  startClickListeners();

  const canvas = document.getElementById('island');
  window.island_canvas = canvas;
  window.ctx = canvas.getContext('2d');

  // These can't be initialized *until* there is a grid:
  // $(canvas).on("click", {grid: grid}, grid.handleClick);
  // $(canvas).on("mousemove", {grid: grid}, grid.handleMouseMove);
};

// ===============================================================================================













// This file will never end!
