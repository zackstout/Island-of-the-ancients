
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = 5000;
const _ = require('lodash');

const BUILD_COSTS = {
  sentry: {
    iron: 2,
    stone: 2
  },
  connector: {
    iron: 3,
    stone: 4
  }
};

let allUsers = [];
let games = [];

const Game = require('./modules/Game.js');

// function

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

  // Helper function for below function, submitMove:
  function computeCosts(verts, edges) {
    let res = {
      iron: 0,
      stone: 0
    };

    res.iron += verts.reduce((sum, v) => sum + BUILD_COSTS.sentry.iron, 0);
    res.iron += edges.reduce((sum, e) => sum + BUILD_COSTS.connector.iron, 0);
    res.stone += verts.reduce((sum, v) => sum + BUILD_COSTS.sentry.stone, 0);
    res.stone += edges.reduce((sum, e) => sum + BUILD_COSTS.connector.stone, 0);

    // Why is this getting bigger every time.....?
    console.log("RESULT of REDUCING is...", res);
    return res;
  }



  // ===============================================================================================

  socket.on('submitMove', data => {
    const game = _.find(games, {id: data.gameId});

    game.historyOfMoves.push({
      move_number: game.moveNumber,
      mover: socket.id,
      verts_placed: _.difference(game.boardState.occupied_vertices, data.vertices),
      edges_placed: _.difference(game.boardState.occupied_edges, data.edges)
    });

    // NOTE: Next step would be to subtract from their resources to pay expenses.

    game.boardState.occupied_vertices = data.vertices;
    game.boardState.occupied_edges = data.edges;

    game.moveNumber ++;

    // Swap mover:
    if (game.mover == game.player1) game.mover = game.player2;
    else game.mover = game.player1;

    // Deduct costs for proper player:
    if (socket.id == game.player1.id) {
      game.player1.bank.iron -= computeCosts(data.vertices, data.edges).iron;
      game.player1.bank.stone -= computeCosts(data.vertices, data.edges).stone;
    } else {
      game.player2.bank.iron -= computeCosts(data.vertices, data.edges).iron;
      game.player2.bank.stone -= computeCosts(data.vertices, data.edges).stone;
    }

    // Ugly:
    let enemyId;
    if (data.gameId.indexOf(socket.id) == 0) {
      enemyId = data.gameId.substring(socket.id.length);
    } else {
      enemyId = data.gameId.substring(0, data.gameId.indexOf(socket.id));
    }
    // console.log(game);
    socket.broadcast.to(enemyId).emit('submitMove', game);
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


app.use(express.static('server/public'));

http.listen(PORT, err => {
  if (err) {
    console.log(`Error listening on port ${PORT}`,err);
  } else {
    console.log(`Listening on port ${PORT}...`);
  }
});
