
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
  $('body').on('click', '.buildAmmo', ev => {

    // This looks wrong -- we don't know about grid here, do we?
    if (canBuild(grid.current_bank, grid.staged_cost, 'ammo')) {
      buildAmmo(grid);
      stagedAmmo ++;
    }

    // I don't think we need to emit to server here....Just keep track of how many clicks since last move, and attach that to submitMove emission.
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
      // ALSO EMIT AMMO BUILT, AMMO FIRED, VERTS DESTROYED, CITADELS BUILT.
    });
    stagedAmmo = 0;
  });

  // ===============================================================================================



  // ===============================================================================================

}
