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
  let sentDate = new Date(message.createdAt);
  let sentAt = `<b>Sent: ${sentDate.toLocaleDateString()} ${sentDate.toString().slice(16,24)}</b>`;
  newElement.innerHTML = `${message.from}: ${message.text}. ${sentAt}`;
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