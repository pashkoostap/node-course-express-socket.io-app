const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const publicPath = path.join(__dirname, '../public');

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.userName) || !isRealString(params.chatRoom)) {
      callback('Username and chat-room name are required');
    }
    callback();
  })

  socket.emit('newMessage', generateMessage('Admin', 'Wellcome to chat app'));
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));

  });

  socket.on('disconnect', () => {
    console.log('new user disconnected');
  });
})

server.listen(port, () => {
  console.log(`Server is running on ${port}`)
});