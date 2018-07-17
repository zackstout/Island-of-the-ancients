
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = 5000;
const _ = require('lodash');
const helpers = require('./modules/helper_functions.js');
const computeCosts = helpers.computeCosts;
const computeGains = helpers.computeGains;
const getDifferenceVertices = helpers.getDifferenceVertices;
const getDifferenceEdges = helpers.getDifferenceEdges;

let allUsers = [];
let games = [];

const Game = require('./modules/Game.js');

// ===============================================================================================

io.on('connection', socket => {
  console.log(`Client id ${socket.id} connected.`);
  allUsers.push(socket.id);
  io.emit('ids', allUsers);

  // ===============================================================================================

  socket.on('startGame', players => {
    const p1 = players.p1;
    const p2 = players.p2;
    const game = new Game(p1, p2, 12, 12);
    games.push(game);
    // console.log(game);

    // Emit to everyone; check on client-side if they are in the game.
    io.emit('startGame', game); // Should this be called same thing? Guess it doesn't matter.
  });

  // ===============================================================================================

  socket.on('submitMove', data => {
    const game = _.find(games, {id: data.gameId});
    const new_verts = getDifferenceVertices(game.boardState.occupied_vertices, data.vertices);
    const new_edges = getDifferenceEdges(game.boardState.occupied_edges, data.edges);
    // console.log("NEW STUFF: ", new_verts, new_edges);

    game.historyOfMoves.push({
      move_number: game.moveNumber,
      mover: socket.id,
      verts_placed: new_verts,
      edges_placed: new_edges
    });

    game.boardState.occupied_vertices = data.vertices;
    game.boardState.occupied_edges = data.edges;
    game.moveNumber ++;

    // Swap mover:
    if (game.mover == game.player1) game.mover = game.player2;
    else game.mover = game.player1;
    
    // Deduct COSTS for proper player and add RESOURCES for next player before the turn is passed back to them:
    // Surely a cleaner way to write with variable property:
    if (socket.id == game.player1.id) {
      game.player1.bank.iron -= computeCosts(new_verts, new_edges).iron;
      game.player1.bank.stone -= computeCosts(new_verts, new_edges).stone;
      game.player2.bank.iron += computeGains(data.vertices, data.edges, game.boardState.cells, game.player2).iron;
      game.player2.bank.stone += computeGains(data.vertices, data.edges, game.boardState.cells, game.player2).stone;
    } else {
      game.player2.bank.iron -= computeCosts(new_verts, new_edges).iron;
      game.player2.bank.stone -= computeCosts(new_verts, new_edges).stone;
      game.player1.bank.iron += computeGains(data.vertices, data.edges, game.boardState.cells, game.player1).iron;
      game.player1.bank.stone += computeGains(data.vertices, data.edges, game.boardState.cells, game.player1).stone;
    }

    // Ugly way of determining player's enemy:
    let enemyId;
    if (data.gameId.indexOf(socket.id) == 0) {
      enemyId = data.gameId.substring(socket.id.length);
    } else {
      enemyId = data.gameId.substring(0, data.gameId.indexOf(socket.id));
    }

    // Communicate with enemy player and player who just moved:
    socket.broadcast.to(enemyId).emit('submitMove', game);
    socket.emit('submitMove', game);
  });

  // ===============================================================================================





  // ===============================================================================================

  socket.on('invite', inv => {
    socket.broadcast.to(inv.to).emit('msg', inv.from);
  });

  // ===============================================================================================

  socket.on('disconnect', function() {
    // console.log('user disconnected', socket.id);
    allUsers.splice(allUsers.indexOf(socket.id), 1);
    io.emit('ids', allUsers);
  });

  // ===============================================================================================
});



// ===============================================================================================


app.use(express.static('server/public'));

http.listen(PORT, err => {
  if (err) {
    console.log(`Error listening on port ${PORT}`,err);
  } else {
    console.log(`Listening on port ${PORT}...`);
  }
});
