
export const socket = window.io('http://localhost:5000');
import { drawGrid } from './Drawing.js';

// Get list of all online users:
socket.on('ids', function(ids) {
  console.log(ids, socket.id);
  $('#otherUsers').empty();
  $('#otherUsers').append('Other users online: <br><br>');

  for (var i=0; i < ids.length; i++) {
    if (socket.id !== ids[i]) {
      $('#otherUsers').append($('<span>').text(ids[i]));
      var btn = '<button class="sub" data-to="' + ids[i] + '" data-from="' + socket.id + '">Send</button>';
      $('#otherUsers').append($('<span>').append(btn));
      $('#otherUsers').append($('<span>').append('<br>'));
    }
  }
});

// Receive invite:
socket.on('msg', function(inv) {
  console.log(inv);
  $('#log').append(inv + ' would like to play a game with you!');
  var play = '<button class="play" data-from="' + inv + '" data-to="' + socket.id + '">Play</button>';
  $('#log').append(play);
});

// Draw both grids:
socket.on('startGame', function(game) {
  if (socket.id == game.player1.id || socket.id == game.player2.id) {
    drawGrid(game.grid, game.boardState.occupied_vertices);
  }
  console.log(game);
  $('#island').on("click", {grid: game.grid}, game.grid.handleClick);
  // $(canvas).on("mousemove", {grid: game.grid}, game.grid.handleMouseMove);
});
