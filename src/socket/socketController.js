const { Message } = require('../models/index');
const logger = require('../utils/logger');
const chatHandler = require('./handlers/chat');
const onlineDetector = require('./handlers/onlineDetector');
const testing = require('./handlers/testing');

const onlinePeopleList = [];

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    chatHandler(socket, io);

    socket.on('online-display', (data) => {
      const socketId = socket.id;
      const myId = data?.myId;
      const user = { socketId, myId };
      // Check if the user is already in the list before adding them
      const existingUser = onlinePeopleList.find((u) => u.myId === myId);
      if (!existingUser) {
        onlinePeopleList.push(user);
      }

      // Broadcast the updated online people list to all connected clients
      io.emit('online-people-list', onlinePeopleList);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');

      // Remove the disconnected user from the onlinePeopleList
      const index = onlinePeopleList.findIndex((user) => user.socketId === socket.id);
      if (index !== -1) {
        onlinePeopleList.splice(index, 1);

        // Broadcast the updated online people list to all connected clients
        io.emit('online-people-list', onlinePeopleList);
      }
    });
  });
};
