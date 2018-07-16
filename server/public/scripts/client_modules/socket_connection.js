
export const socket = window.io('http://localhost:5000');
import { Grid } from './classes/Grid.js';

const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 500;

// ===============================================================================================

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
  // console.log(inv);
  $('#log').append(inv + ' would like to play a game with you!');
  var play = '<button class="play" data-from="' + inv + '" data-to="' + socket.id + '">Play</button>';
  $('#log').append(play);
});

// ===============================================================================================

// Draw both grids:
socket.on('startGame', function(game) {
  // But only if the player is part of the game! Surely a cleaner way.
  if (socket.id == game.player1.id || socket.id == game.player2.id) {

    const grid = new Grid(CANVAS_WIDTH, CANVAS_HEIGHT, game.numCellsW, game.numCellsH);
    grid.player = socket.id == game.player1.id ? game.player1 : game.player2;
    grid.enemy = socket.id == game.player1.id ? game.player2 : game.player1;

    grid.cells = game.boardState.cells;
    const occ_vertices = game.boardState.occupied_vertices;
    const occ_edges = game.boardState.occupied_edges;
    grid.occ_vertices = occ_vertices;
    grid.occ_edges = occ_edges;

    console.log(game, grid);

    window.grid = grid;

    // Draw the grid:
    grid.drawGrid(occ_vertices, occ_edges);

    // Add event listeners:
    $('#island').on('click', {grid: grid}, grid.handleClick);

    // Why so buggy??
    // $('#island').on('mouseover', {grid: grid}, grid.handleMouseMove);

    // Nice -- only listen on active player's clicks:
    if (grid.player == game.player2) {
      $('#island').off('click');
    }

    // Is it your move?
    const move_or_wait_html = socket.id == game.player1.id ? '<button class="subMove">End Turn</button>' : 'Zzz....';
    $('.moveOrWait').html(move_or_wait_html);

    const bank_html = `
      Iron: ${grid.player.bank.iron} <br/>
      Stone: ${grid.player.bank.stone}
    `;

    $('.bank_account').html(bank_html);
  }

});

// ===============================================================================================

// Prepare screen for a player's new move; called right after other user has moved and server has computed:
socket.on('submitMove', gameState => {
  console.log(gameState, socket);
  const verts = gameState.boardState.occupied_vertices;
  const edges = gameState.boardState.occupied_edges;
  grid.occ_vertices = verts;
  grid.occ_edges = edges;
  grid.drawGrid(verts, edges);

  if (gameState.mover.id == socket.id) {
    console.log('well hello there mover');
    $('#island').on('click', {grid: grid}, grid.handleClick);
  } else {
    console.log('you are not the mover!');
    $('#island').off('click');
  }

  // Is it your move?
  const html_out = socket.id == gameState.mover.id ? '<button class="subMove">End Turn</button>' : 'Zzz....';
  $('.moveOrWait').html(html_out);

  let bank_html;
  if (gameState.player1.id == socket.id) {
    bank_html = `
      Iron: ${gameState.player1.bank.iron} <br/>
      Stone: ${gameState.player1.bank.stone}
    `;
  } else {
    bank_html = `
      Iron: ${gameState.player2.bank.iron} <br/>
      Stone: ${gameState.player2.bank.stone}
    `;
  }

  $('.bank_account').html(bank_html);
});

// ===============================================================================================


// ===============================================================================================
