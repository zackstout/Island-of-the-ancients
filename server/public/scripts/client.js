
// It's clearly not going to work to make grid a global var:
let height, width, ctx, grid;
let allUsers = [];

import { Grid } from './Grid.js';
import { drawGrid } from './Drawing.js';
import { generateTestEdges, generateTestVertices } from './Test.js';


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
    gameId = game.id;
    console.log("Game: ", game);
    currentGame = game;

    if (socket.id == game.p1) {
      $('#log').append("<p>You are player one!</p>");
      drawTable();
      playerToMove = true;
      $('#moving').show();
    } else if (socket.id == game.p2) {
      $('#log').append("<p>you are player two :(</p>");
      drawTable();
      $('#waiting').show();
      $('.move').hide();
    }
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
  ctx = canvas.getContext('2d');
  window.ctx = ctx;

  grid = new Grid(height, width, 12, 12);
  console.log(grid);

  const test_edges = generateTestEdges(50, grid);
  const test_vertices = generateTestVertices(30, grid);

  // make the variables globally available (to all modules):
  window.test_edges = test_edges;
  window.test_vertices = test_vertices;


  drawGrid(grid, test_vertices, test_edges);

  // Determine which cell was clicked on, find nearest vertex:
  canvas.addEventListener("click", handleClick);
  // canvas.addEventListener("onmousemove", moveMouse);

  canvas.onmousemove = moveMouse;
};

// ===============================================================================================

function handleClick(e) {
  const mouse = {x: e.offsetX, y: e.offsetY};
  const cell = grid.getClickedCell(mouse);
  grid.getNearestVertex(mouse);
  // grid.getNearestEdge(mouse);
  grid.distanceToEdges(cell, mouse);
}

// ===============================================================================================

function moveMouse(e) {
  const mouse = {x: e.offsetX, y: e.offsetY};
  const cell = grid.getClickedCell(mouse);
  const threshhold = 8;
  const distances = grid.distanceToEdges(cell, mouse);
  let filtered = [];
  let result;

  for (let i=0; i < distances.length; i++) {
    if (distances[i] < threshhold) {
      filtered.push(cell.edges[i]);
    }
  }

  // We have an edge, and filtered is it:
  if (filtered.length == 1) {
    result = filtered[0];
  }

  // We have a vertex, and filtered is a pair of edges:
  if (filtered.length == 2) {
    const edge1 = getCommonLetter(filtered[0][0].pos, filtered[0][1].pos);
    const edge2 = getCommonLetter(filtered[1][0].pos, filtered[1][1].pos);
    const vertex = getProperOrder(edge1 + edge2);
    result = _.find(cell.vertices, {pos: vertex});
  }

  drawGrid(grid, test_vertices, test_edges);

  const w = grid.cell_width;
  const h = grid.cell_height;

  // Edge:
  if (filtered.length == 1) {
    ctx.beginPath();
    ctx.moveTo(result[0].x * w, result[0].y * h);
    ctx.lineTo(result[1].x * w, result[1].y * h);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'green';
    ctx.stroke();
  }

  // Vertex:
  if (filtered.length == 2) {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(result.x * w, result.y * h, 10, 0, 2*Math.PI);
    ctx.fill();
  }
}

// Returns the letter denoting an edge, e.g. "U" for upper:
function getCommonLetter(str1, str2) {
  const letters = ["U", "R", "B", "L"];
  for (let i=0; i < letters.length; i++) {
    const l = letters[i];
    if (str1.includes(l) && str2.includes(l)) {
      return l;
    }
  }
}

function getProperOrder(str) {
  if (str[0] == "R" || str[0] == "L") return str.split("").reverse().join("");
  return str;
}












// This file will never end!
