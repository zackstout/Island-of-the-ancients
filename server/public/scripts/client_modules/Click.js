
import { socket } from './Socket.js';

export function startClickListeners() {

    // Send invite:
    $('body').on('click', '.sub', ev => {
      socket.emit('invite', {
        to: $(ev.currentTarget).data('to'),
        from: $(ev.currentTarget).data('from')
      });
    });


    // Accept invite:
    $('#log').on('click', '.play', (event) => {
      var p1, p2;

      // Randomly choose player 1:
      if (Math.random() > 0.5) {
        p1 = $(event.currentTarget).data('to');
        p2 = $(event.currentTarget).data('from');
      } else {
        p2 = $(event.currentTarget).data('to');
        p1 = $(event.currentTarget).data('from');
      }

      console.log(p1, p2, socket.id);

      socket.emit('startGame', {
        p1: p1,
        p2: p2
      });
    });
}
