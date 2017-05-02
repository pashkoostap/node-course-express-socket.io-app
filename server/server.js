const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');
const publicPath = path.join(__dirname, '../public');

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.userName) || !isRealString(params.chatRoom)) {
      return callback('Username and chat-room name are required');
    }
    socket.join(params.chatRoom);
    // socket.leave(params.chatRoom);

    users.removeUser(socket.id);
    users.addUser(socket.id, params.userName, params.chatRoom);

    io.to(params.chatRoom).emit('updateUserList', users.getUsersList(params.chatRoom));

    socket.emit('newMessage', generateMessage('Admin', 'Wellcome to chat app'));
    socket.broadcast.to(params.chatRoom).emit('newMessage', generateMessage('Admin', `${params.userName} joined`));

    callback();
  })

  socket.on('createMessage', (message) => {
    let user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text))
    }

  });

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUsersList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
  });
})

server.listen(port, () => {
  console.log(`Server is running on ${port}`)
});