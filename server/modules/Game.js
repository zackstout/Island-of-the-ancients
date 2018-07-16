
var Player = require('./Player.js');
const resources = ['iron', 'stone'];

// Takes in two user Ids and creates a new Game:
function Game(p1, p2, w, h) {
  this.player1 = new Player(p1, [0, 0]);
  this.player2 = new Player(p2, [0, 0]);
  this.mover = this.player1;
  this.historyOfMoves = [];
  this.numCellsW = w;
  this.numCellsH = h;

  this.generateNexuses = function() {
    const x1 = Math.floor(Math.random() * this.grid.numCellsW);
    const y1 = Math.floor(Math.random() * this.grid.numCellsH);
    const x2 = Math.floor(Math.random() * this.grid.numCellsW);
    const y2 = Math.floor(Math.random() * this.grid.numCellsH);
    while (this.x2 == this.x1) {
      this.x2 = Math.floor(Math.random() * this.grid.numCellsW);
    }
    this.player1.nexus = {x: x1, y: y1};
    this.player2.nexus = {x: x2, y: y2};
    this.boardState.occupied_vertices.push({x: x1, y: y1, occupant: 'P1'});
    this.boardState.occupied_vertices.push({x: x2, y: y2, occupant: 'P2'});
  };

  this.generateCells = function() {
    for (let i=0; i < this.numCellsW; i++) {
      for (let j=0; j < this.numCellsH; j++) {
        const resource = Math.random() > 0.5 ? resources[0] : resources[1];
        const cell = new Cell(i, j, resource);
        this.boardState.cells.push(cell);
      }
    }
  };

  this.boardState = {
    cells: [],
    occupied_vertices: [],
    occupied_edges: []
  };

  this.generateNexuses();
}


function Cell(x, y, resource) {
  this.x = x;
  this.y = y;
  this.resource = resource;
}


module.exports = Game;
