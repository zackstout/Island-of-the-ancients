
let height, width;

import { startClickListeners } from './client_modules/click_handlers.js';
import { socket } from './client_modules/socket_connection.js';

// ===============================================================================================

window.onload = function() {
  height = document.getElementById('island').height;
  width = document.getElementById('island').width;

  startClickListeners();

  const canvas = document.getElementById('island');
  window.ctx = canvas.getContext('2d');
};

// ===============================================================================================













// This file will never end!
