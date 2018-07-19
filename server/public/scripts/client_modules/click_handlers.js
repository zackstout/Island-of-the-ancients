
import { socket } from './socket_connection.js';
import { canBuild, buildAmmo } from './general_functions.js';

export function startClickListeners() {

  $('.weapon').hide();


  // Send invite:
  $('body').on('click', '.sub', ev => {
    socket.emit('invite', {
      to: $(ev.currentTarget).data('to'),
      from: $(ev.currentTarget).data('from')
    });
  });
  // ===============================================================================================

  // Build ammo:
  $('body').on('click', '.weapon', ev => {

    if (canBuild(grid.current_bank, grid.staged_cost, 'ammo')) {
      buildAmmo(grid);
    }
    // socket.emit('invite', {
    //   to: $(ev.currentTarget).data('to'),
    //   from: $(ev.currentTarget).data('from')
    // });
  });

  // ===============================================================================================

  // Accept invite:
  $('#log').on('click', '.play', ev => {
    var p1, p2;

    // Randomly choose player 1:
    if (Math.random() > 0.5) {
      p1 = $(ev.currentTarget).data('to');
      p2 = $(ev.currentTarget).data('from');
    } else {
      p2 = $(ev.currentTarget).data('to');
      p1 = $(ev.currentTarget).data('from');
    }

    socket.emit('startGame', {
      p1: p1,
      p2: p2
    });
  });

  // ===============================================================================================

  $('body').on('click', '.subMove', ev => {
    $('.projectedIron').html(0);
    $('.projectedStone').html(0);
    console.log(grid);
    const gameId = grid.player.num == 1 ? grid.player.id + grid.enemy.id : grid.enemy.id + grid.player.id; // bad for security but whatever
    socket.emit('submitMove', {
      staged_edges: grid.stagedEdges,
      staged_vertices: grid.stagedVertices,
      gameId: gameId
    });
  });

  // ===============================================================================================



  // ===============================================================================================

}
