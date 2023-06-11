const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });

  // Handle a custom event
  socket.on('chat message', (message) => {
    console.log('Received message:', message);

    // Broadcast the message to all connected clients
    io.emit('chat message', message);
  });
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});
