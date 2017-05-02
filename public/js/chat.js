let socket = io();
let form = document.getElementById('message-form');
let inputField = form.querySelector('input');
let messagesList = document.querySelector('.messages-list');
let userList = document.querySelector('.users-list');

socket.on('connect', () => {
  console.info('connected');
  let params = parseQueryString();
  let userName = params['username'][0] || '';
  let chatRoom = params['chat-room'][0] || '';

  socket.emit('join', { userName, chatRoom }, (err) => {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No errors');
    }
  })
});

socket.on('disconnect', () => {
  console.info('disconnected');
});

socket.on('updateUserList', (users) => {
  let usersArr = [...users];
  userList.innerHTML = '';
  usersArr.forEach(user => {
    let userEl = document.createElement('li');
    userEl.innerText = user;
    userList.appendChild(userEl);
  })
})

socket.on('newMessage', (message) => {
  console.log('newMessage', message);
  let newElement = document.createElement('li');
  let sentDate = new Date(message.createdAt);
  let sentAt = `<b>Sent: ${sentDate.toLocaleDateString()} ${sentDate.toString().slice(16, 24)}</b>`;
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
function parseQueryString() {
  var query = (window.location.search || '?').substr(1),
    map = {};
  query.replace(/([^&=]+)=?([^&]*)(?:&+|$)/g, function (match, key, value) {
    (map[key] = map[key] || []).push(value);
  });
  return map;
}