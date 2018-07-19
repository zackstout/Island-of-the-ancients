
var Player = require('./Player.js');
const resources = ['iron', 'stone'];

// Takes in two user Ids and creates a new Game:
function Game(p1, p2, w, h) {
  this.player1 = new Player(p1, [10, 20], 1);
  this.player2 = new Player(p2, [20, 10], 2);
  this.numCellsW = w;
  this.numCellsH = h;
  this.id = this.player1.id + this.player2.id;
  this.moveNumber = 0;

  this.mover = this.player1;
  this.historyOfMoves = [];
  this.boardState = {
    cells: [],
    occupied_vertices: [],
    occupied_edges: []
  };

  // ===============================================================================================

  this.generateNexuses = function() {
    // Disallow nexuses on edge of map:
    const x1 = Math.floor(Math.random() * (this.numCellsW - 2)) + 1;
    const y1 = Math.floor(Math.random() * (this.numCellsH - 2)) + 1;
    let x2 = Math.floor(Math.random() * (this.numCellsW - 2)) + 1;
    const y2 = Math.floor(Math.random() * (this.numCellsH - 2)) + 1;
    // !!! How did we get identically-located nexuses?? Because we had 'this' needlessly:
    while (x2 == x1) {
      x2 = Math.floor(Math.random() * this.numCellsW);
    }
    this.player1.nexus = {x: x1, y: y1, stagedForUpgrade: false, upgraded: false};
    this.player2.nexus = {x: x2, y: y2, stagedForUpgrade: false, upgraded: false};
    this.boardState.occupied_vertices = [
      {x: x1, y: y1, occupant: 'P1', nexus: true},
      {x: x2, y: y2, occupant: 'P2', nexus: true}
    ];
  };

  // ===============================================================================================

  this.generateCells = function() {
    for (let i=0; i < this.numCellsW; i++) {
      for (let j=0; j < this.numCellsH; j++) {
        const resource = Math.random() > 0.5 ? resources[0] : resources[1];
        const cell = new Cell(i, j, resource);
        this.boardState.cells.push(cell);
      }
    }
  };

  // ===============================================================================================

  this.generateNexuses();
  this.generateCells();
}


function Cell(x, y, resource) {
  this.x = x;
  this.y = y;
  this.resource = resource;
}


module.exports = Game;
