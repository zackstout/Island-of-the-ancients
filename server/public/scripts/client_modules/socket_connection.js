
export const socket = window.io('http://localhost:5000');
import { Grid } from './classes/Grid.js';
import { computeCosts } from './general_functions.js';

// These are magic numbers still:
const CANVAS_HEIGHT = 400;
const CANVAS_WIDTH = 400;

// ===============================================================================================

// Get list of all online users:
socket.on('ids', function(ids) {
  console.log(ids, socket.id);
  $('.economy').hide();

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
  $('#log').append(inv + ' would like to play a game with you!');
  var play = '<button class="play" data-from="' + inv + '" data-to="' + socket.id + '">Play</button>';
  $('#log').append(play);
});

// ===============================================================================================

// Draw both grids:
socket.on('startGame', function(game) {
  $('.economy').show();

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

    grid.current_bank.iron = game.player1.bank.iron;
    grid.current_bank.stone = game.player1.bank.stone;

    // Nice -- only listen on active player's clicks:
    if (grid.player == game.player2) {
      $('#island').off('click');
    }

    // Is it your move?
    const move_or_wait_html = socket.id == game.player1.id ? '<button class="subMove">End Turn</button>' : 'Zzz....';
    $('.moveOrWait').html(move_or_wait_html);

    // Update economy Dom:
    $('.bankIron').html(`${grid.player.bank.iron}`);
    $('.bankStone').html(`${grid.player.bank.stone}`);
    $('.projectedIron').html(0);
    $('.projectedStone').html(0);
    $('.harvestIron').html(0);
    $('.harvestStone').html(0);
  }
});

// ===============================================================================================

// Prepare screen for a player's new move; called right after other user has moved and server has computed:
socket.on('submitMove', gameState => {
  console.log(gameState, socket);
  const verts = gameState.boardState.occupied_vertices;
  const edges = gameState.boardState.occupied_edges;

  grid.stagedVertices = [];
  grid.stagedEdges = [];

  grid.occ_vertices = verts;
  grid.occ_edges = edges;
  grid.drawGrid(verts, edges);

  // Is it your move?
  let html_out;
  if (gameState.mover.id == socket.id) {
    $('#island').on('click', {grid: grid}, grid.handleClick);
    html_out = '<button class="subMove">End Turn</button>';
  } else {
    $('#island').off('click');
    html_out = 'Zzz....';
  }
  $('.moveOrWait').html(html_out);

  const player = gameState.player1.id == socket.id ? 'player1' : 'player2';

  // Attach to grid object so clicks can access it:
  grid.current_bank.iron = gameState[player].bank.iron;
  grid.current_bank.stone = gameState[player].bank.stone;

  // Update economy Dom:
  $('.bankIron').html(`${gameState[player].bank.iron}`);
  $('.bankStone').html(`${gameState[player].bank.stone}`);

  // this should prob also be controlled by Grid.js
  $('.harvestIron').html(`${gameState[player].tempBank.iron}`);
  $('.harvestStone').html(`${gameState[player].tempBank.stone}`);


  if (grid.player.nexus.upgraded) {
    $('.weapon').show();
  }
});

// ===============================================================================================




// ===============================================================================================
