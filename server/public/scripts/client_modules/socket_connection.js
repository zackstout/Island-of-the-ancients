
export const socket = window.io('http://localhost:5000');
import { Grid } from './Grid.js';
const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 500;

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

// ===============================================================================================

// Receive invite:
socket.on('msg', function(inv) {
  console.log(inv);
  $('#log').append(inv + ' would like to play a game with you!');
  var play = '<button class="play" data-from="' + inv + '" data-to="' + socket.id + '">Play</button>';
  $('#log').append(play);
});

// ===============================================================================================

// Draw both grids:
socket.on('startGame', function(game) {
  if (socket.id == game.player1.id || socket.id == game.player2.id) {

    const grid = new Grid(CANVAS_WIDTH, CANVAS_HEIGHT, game.numCellsW, game.numCellsH);
    grid.cells = game.boardState.cells;
    const occ_vertices = game.boardState.occupied_vertices;
    const occ_edges = game.boardState.occupied_edges;
    grid.occ_vertices = occ_vertices;
    grid.occ_edges = occ_edges;

    console.log(game, grid);

    // Draw the grid:
    grid.drawGrid(occ_vertices, occ_edges);

    // Add event listeners:
    $('#island').on('click', {grid: grid}, grid.handleClick);
    // $('#island').on('mouseover', {grid: grid}, grid.handleMouseMove);

    // Is it your move?
    const html_out = socket.id == game.player1.id ? '<button class="subMove">End Turn</button>' : 'Zzz....';
    $('.moveOrWait').html(html_out);
  }

});

// ===============================================================================================


// ===============================================================================================


// ===============================================================================================
