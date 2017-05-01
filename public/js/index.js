let socket = io();

socket.on('connect', () => {
  console.info('connected');

  socket.emit('createMessage', {
    from: 'user 1',
    text: 'Hello',
    createdAt: new Date().getTime()
  })
});

socket.on('disconnect', () => {
  console.info('disconnected');
});

socket.on('newMessage', (message) => { 
  console.log('newMessage', message);
});