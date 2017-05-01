let socket = io();
let form = document.getElementById('message-form');
let inputField = form.querySelector('input');
let messagesList = document.querySelector('.messages-list');

socket.on('connect', () => {
  console.info('connected');
});

socket.on('disconnect', () => {
  console.info('disconnected');
});

socket.on('newMessage', (message) => {
  console.log('newMessage', message);
  let newElement = document.createElement('li');
  newElement.innerText = `${message.from}: ${message.text}`;
  messagesList.appendChild(newElement);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let messageText = inputField.value;
  if (messageText) {
    socket.emit('createMessage', {
      from: 'User',
      text: messageText
    }, (data) => {
      console.log('Got it', data);
    });
    inputField.value = '';
  }
})