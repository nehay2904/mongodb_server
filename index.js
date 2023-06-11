const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
  console.log('A client connected.');

  socket.on('request', (requestData) => {
    // Process the request and send the response back to the client
    const responseData = 'This is the response data';
    socket.emit('response', responseData);
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected.');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
