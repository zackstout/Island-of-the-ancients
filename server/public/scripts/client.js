
// It's clearly not going to work to make grid a global var:
let height, width, ctx, grid;
import { Grid } from './Grid.js';
import { drawGrid } from './Drawing.js';
import { generateTestEdges } from './Test.js';
import { generateTestVertices } from './Test.js';

const test_edges = generateTestEdges(50);
const test_vertices = generateTestVertices(30);

// make the variables globally available (to all modules):
window.test_edges = test_edges;
window.test_vertices = test_vertices;
console.log({test_edges},{test_vertices});
// ===============================================================================================

window.onload = function() {
  height = document.getElementById('island').height;
  width = document.getElementById('island').width;

  const socket = window.io('http://localhost:5000');

  // Get list of all online users:
  socket.on('ids', function(ids) {
    console.log(ids, socket.id);
    $('#otherUsers').empty();
    $('#otherUsers').append('Other users online: <br><br>');

    for (var i=0; i < ids.length; i++) {
      if (socket.id !== ids[i]) {
        $('#otherUsers').append($('<span>').text(ids[i]));
        var btn = '<button class="sub" data-to="' + ids[i] + '" data-from="' + socket.id + '">Send</button>';
        $('#otherUsers').append($('<span>').append(btn));
        $('#otherUsers').append($('<span>').append('<br>'));
      }
    }
  });


  $('body').on('click', '.sub', ev => {
    socket.emit('invite', {
      to: $(ev.currentTarget).data('to'),
      from: $(ev.currentTarget).data('from')
    });
  });

  // Receive invite:
  socket.on('msg', function(inv) {
    console.log(inv);
    $('#log').append(inv + ' would like to play a game with you!');
    var play = '<button class="play" data-from="' + inv + '" data-to="' + socket.id + '">Play</button>';
    $('#log').append(play);
  });

  // Draw both grids:
  socket.on('startGame', function(game) {


  });

  // Accept invite:
  $('#log').on('click', '.play', (event) => {
    var p1, p2;

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


  const canvas = document.getElementById('island');
  window.ctx = canvas.getContext('2d');

  grid = new Grid(height, width, 12, 12);
  console.log(grid);

  drawGrid(grid, test_vertices, test_edges);

  // Determine which cell was clicked on, find nearest vertex:
  canvas.addEventListener("click", handleClick);
  canvas.addEventListener("mousemove",handleMouseMove);
};

// ===============================================================================================

function handleClick(e) {
  const mouse = {x: e.offsetX, y: e.offsetY};
  const cell = grid.getClickedCell(mouse);
  grid.getNearestVertex(mouse);
  grid.getNearestEdge(mouse);
  grid.distanceToEdges(cell, mouse);
}

// ===============================================================================================

function handleMouseMove(e) {
  console.log(e);
  const mouse = {x: e.offsetX, y: e.offsetY};
  console.log(grid.detectBoardFeature(mouse));
}















// This file will never end!
