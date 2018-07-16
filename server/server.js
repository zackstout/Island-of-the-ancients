
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = 5000;
const _ = require('lodash');

let allUsers = [];
let games = [];

const Game = require('./modules/Game.js');


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
    // console.log(enemyId, "and then", data.gameId.substring(0, data.gameId.indexOf(enemyId)), "yup");

    // NOTE: This is wrong: we only want to add to verts_placed what WASN'T on vertices before. So... _.diff?
    game.historyOfMoves.push({
      move_number: game.moveNumber,
      mover: socket.id,
      verts_placed: data.vertices,
      edges_placed: data.edges
    });
    // NOTE: Don't forget to swap game.mover
    // NOTE: Next step would be to subtract from their resources to pay expenses.

    game.boardState.occupied_vertices = game.boardState.occupied_vertices.concat(data.vertices);
    game.boardState.occupied_edges = game.boardState.occupied_edges.concat(data.edges);
    game.moveNumber ++;

    if (game.mover == game.player1) game.mover = game.player2;
    else game.mover = game.player1;

    // Ugly:
    let enemyId;
    if (data.gameId.indexOf(socket.id) == 0) {
      enemyId = data.gameId.substring(socket.id.length);
    } else {
      enemyId = data.gameId.substring(0, data.gameId.indexOf(socket.id));
    }
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
