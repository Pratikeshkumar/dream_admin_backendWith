const { Message } = require('../models/index');
const logger = require('../utils/logger');
const chatHandler = require('./handlers/chat');
const onlineDetector = require('./handlers/onlineDetector');
const testing = require('./handlers/testing');
const videoCall = require('./handlers/videoCall')
const {
  live_count
} = require('./handlers/liveStream')

const onlinePeopleList = [];

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    chatHandler(socket, io);
    videoCall(socket, io);
    live_count(socket, io)


    socket.on('online-display', (data) => {
      const socketId = socket.id;
      const myId = data?.myId;
      const user = { socketId, myId };
      const existingUser = onlinePeopleList.find((u) => u.myId === myId);
      if (!existingUser) {
        onlinePeopleList.push(user);
      }
      io.emit('online-people-list', onlinePeopleList);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');

      const index = onlinePeopleList.findIndex((user) => user.socketId === socket.id);
      if (index !== -1) {
        onlinePeopleList.splice(index, 1);
        io.emit('online-people-list', onlinePeopleList);
      }
    });
  });
};
