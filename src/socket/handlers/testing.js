module.exports = (socket, io) => {
    socket.on('chat message', (message) => {
      // Broadcast the received message to all connected clients
      io.emit('chat message', message);
    });
  };
  