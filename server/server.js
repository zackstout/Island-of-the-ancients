const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = 5000;

let allUsers = [];
let games = [];


const Game = require('./modules/Game.js');

io.on('connection', socket => {
  console.log(`Client id ${socket.id} connected.`);
  allUsers.push(socket.id);
  // console.log(allUsers);
  io.emit('ids', allUsers);

  socket.on('startGame', players => {
    const p1 = players.p1;
    const p2 = players.p2;
    const game = new Game(p1, p2, 12, 12);
    games.push(game);
    // Emit to everyone; check on client-side if they are in the game.
    io.emit('startGame', game); // Should this be called same thing? Guess it doesn't matter.
  });

  socket.on('invite', inv => {
    socket.broadcast.to(inv.to).emit('msg', inv.from);
  });

  socket.on('disconnect', function() {
    // console.log('user disconnected', socket.id);
    allUsers.splice(allUsers.indexOf(socket.id), 1);
    // console.log(allUsers);
    io.emit('ids', allUsers);
  });

});

app.use(express.static('server/public'));

http.listen(PORT, err => {
  if (err) {
    console.log(`Error listening on port ${PORT}`,err);
  } else {
    console.log(`Listening on port ${PORT}...`);
  }
});
