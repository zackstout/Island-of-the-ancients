
const socket = window.io('http://localhost:5000');
socket.on('newConnection',data => {
  console.log('newConnection');
  console.log(data);
})
export default socket;