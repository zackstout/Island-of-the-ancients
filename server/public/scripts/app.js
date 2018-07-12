import socket from './modules/socket.js';
import draw from './draw.js';

export default function app() {
  window.addEventListener('mousemove',event => {
    socket.emit('mousemove',{x:event.clientX,y:event.clientY})
  })
  draw();
}