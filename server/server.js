const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = 5000;

app.use(express.static('server/public'));

io.on('connection',socket => {
  console.log(`Client id ${socket.id} connected.`);
  socket.emit('newConnection',{message:`Welcome, ${socket.id}!`});
  socket.on('mousemove',data => console.log(data));
})


http.listen(PORT, err => {
  if (err) {
    console.log(`Error listening on port ${PORT}`,err);
  } else {
    console.log(`Listening on port ${PORT}...`);
  }
})